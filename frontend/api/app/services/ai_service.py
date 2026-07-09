from typing import AsyncGenerator
import uuid
from starlette.concurrency import run_in_threadpool
from supabase import Client
from app.providers.provider_factory import ProviderFactory
from app.prompts.composer import PromptComposer

class AIService:
    def __init__(self, supabase: Client, provider_name: str = "openai"):
        self.supabase = supabase
        self.provider = ProviderFactory.get_provider(provider_name)

    async def get_session_history(self, session_id: str) -> list[dict]:
        """
        H-05: Fetches conversation history for a given session.
        Returns only the fields required by the UI (role, content, created_at).
        """
        def fetch():
            return self.supabase.table("chat_messages")\
                .select("role, content, created_at")\
                .eq("session_id", session_id)\
                .order("created_at")\
                .execute()
        
        try:
            res = await run_in_threadpool(fetch)
            return [
                {"role": row["role"], "text": row["content"], "timestamp": row["created_at"]}
                for row in res.data
            ]
        except Exception:
            return []

    async def stream_chat(self, query: str, session_id: str = None, background_tasks = None) -> AsyncGenerator[str, None]:
        """
        Processes an incoming query, fetches history, attaches system prompt,
        and streams the response through the configured AI provider.
        """
        system_prompt = PromptComposer.get_workspace_system_prompt()
        messages = [{"role": "system", "content": system_prompt}]
        
        # Ensure session exists or create one if none provided
        if not session_id:
            session_id = str(uuid.uuid4())
            def create_session():
                self.supabase.table("chat_sessions").insert({
                    "id": session_id,
                    "title": query[:50] + "...",
                    "model": "gpt-4o",
                    "user_agent": "Aivora Assistant"
                }).execute()
            await run_in_threadpool(create_session)
        else:
            # Try to fetch existing messages
            def fetch_history():
                return self.supabase.table("chat_messages").select("role, content").eq("session_id", session_id).order("created_at").execute()
            
            try:
                history_res = await run_in_threadpool(fetch_history)
                for row in history_res.data:
                    messages.append({"role": row["role"], "content": row["content"]})
            except Exception:
                # Session might not exist yet, create it
                def create_session():
                    self.supabase.table("chat_sessions").insert({
                        "id": session_id,
                        "title": query[:50] + "...",
                        "model": "gpt-4o",
                        "user_agent": "Aivora Assistant"
                    }).execute()
                try:
                    await run_in_threadpool(create_session)
                except Exception:
                    pass
        
        # Append the new user query to the database
        def save_user_msg():
            self.supabase.table("chat_messages").insert({
                "session_id": session_id,
                "role": "user",
                "content": query
            }).execute()
        await run_in_threadpool(save_user_msg)
        
        messages.append({"role": "user", "content": query})
        
        accumulated_response = ""
        try:
            # C-02: Yield properly-formatted SSE chunks so the frontend parser works correctly.
            # Format: "data: {content}\n\n" per the SSE specification (RFC 8898).
            async for chunk in self.provider.generate_stream(messages=messages):
                accumulated_response += chunk
                # Escape newlines inside the chunk so they don't break SSE frame boundaries
                safe_chunk = chunk.replace("\n", "\\n")
                yield f"data: {safe_chunk}\n\n"
            
            # Signal end of stream
            yield "data: [DONE]\n\n"
        finally:
            if accumulated_response:
                # Save the assistant response to the database
                def save_assistant_msg():
                    # Estimate tokens roughly for now
                    token_usage = len(accumulated_response) // 4
                    self.supabase.table("chat_messages").insert({
                        "session_id": session_id,
                        "role": "assistant",
                        "content": accumulated_response,
                        "token_usage": token_usage
                    }).execute()
                    # Update last_activity on session
                    self.supabase.table("chat_sessions").update({
                        "last_activity": "now()"
                    }).eq("id", session_id).execute()
                
                if background_tasks:
                    background_tasks.add_task(save_assistant_msg)
                else:
                    import asyncio
                    asyncio.create_task(run_in_threadpool(save_assistant_msg))
