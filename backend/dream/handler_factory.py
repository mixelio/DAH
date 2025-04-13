from typing import Optional
from .handlers import (
    MoneyDreamHandler,
    NonMoneyDreamHandler,
    DreamHandler
)
from .models import Dream


class DreamHandlerFactory:
    def get_handler(self, category: str) -> Optional[DreamHandler]:
        match category:
            case Dream.CategoryChoices.MONEY:
                return MoneyDreamHandler()
            case Dream.CategoryChoices.SERVICES | Dream.CategoryChoices.GIFTS:
                return NonMoneyDreamHandler()
            case _:
                raise ValueError(f'Unsupported dream category: {category}')
