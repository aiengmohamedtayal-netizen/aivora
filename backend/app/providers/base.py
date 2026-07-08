from abc import ABC, abstractmethod
from typing import AsyncGenerator, List, Dict, Any

class AIProvider(ABC):
    @abstractmethod
    async def generate_stream(
        self, 
        messages: List[Dict[str, str]], 
        model: str, 
        **kwargs: Any
    ) -> AsyncGenerator[str, None]:
        """
        Generate a stream of text chunks based on the input messages.
        
        Args:
            messages: List of message dicts (e.g., {"role": "user", "content": "hello"})
            model: The identifier of the model to use
            **kwargs: Additional provider-specific parameters
            
        Yields:
            String chunks as they are generated
        """
        pass
        
    @abstractmethod
    async def generate(
        self, 
        messages: List[Dict[str, str]], 
        model: str, 
        **kwargs: Any
    ) -> str:
        """
        Generate a complete text response based on the input messages.
        
        Args:
            messages: List of message dicts
            model: The identifier of the model to use
            **kwargs: Additional provider-specific parameters
            
        Returns:
            The complete generated string
        """
        pass
