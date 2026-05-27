from typing import Generic, TypeVar, Type, List, Optional, Any
from uuid import UUID
from sqlmodel import SQLModel, select
from sqlalchemy.ext.asyncio import AsyncSession

ModelType = TypeVar("ModelType", bound=SQLModel)

class BaseRepository(Generic[ModelType]):
    def __init__(self, model: Type[ModelType], db: AsyncSession):
        self.model = model
        self.db = db

    async def get(self, id: Any) -> Optional[ModelType]:
        return await self.db.get(self.model, id)

    async def get_multi(self, *, skip: int = 0, limit: int = 100) -> List[ModelType]:
        statement = select(self.model).offset(skip).limit(limit)
        results = await self.db.execute(statement)
        return results.scalars().all()

    async def create(self, obj_in: ModelType) -> ModelType:
        self.db.add(obj_in)
        await self.db.commit()
        await self.db.refresh(obj_in)
        return obj_in

    async def update(self, db_obj: ModelType, obj_in: dict) -> ModelType:
        for field, value in obj_in.items():
            setattr(db_obj, field, value)
        self.db.add(db_obj)
        await self.db.commit()
        await self.db.refresh(db_obj)
        return db_obj

    async def remove(self, id: Any) -> ModelType:
        obj = await self.db.get(self.model, id)
        await self.db.delete(obj)
        await self.db.commit()
        return obj
