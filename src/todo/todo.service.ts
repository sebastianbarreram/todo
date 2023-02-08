import { Injectable, NotFoundException } from '@nestjs/common';
import { StatusArgs } from './data-transfer-objects/args/status.args';
import {
  CreateTodoInput,
  UpdateTodoInput,
} from './data-transfer-objects/inputs';
import { TodoEntity } from './entities/todo.entity';

@Injectable()
export class TodoService {
  private todos: TodoEntity[] = [
    { id: 1, description: 'Piedra del Alma', done: false },
    { id: 2, description: 'Piedra del Espacio', done: true },
    { id: 3, description: 'Piedra del Poder', done: false },
    { id: 4, description: 'Piedra del Tiempo', done: false },
  ];

  get totalTodos(): number {
    return this.todos.length;
  }

  get pendingTodos(): number {
    return this.todos.filter((todo) => todo.done === false).length;
  }

  get completedTodos(): number {
    return this.todos.filter((todo) => todo.done === true).length;
  }

  findAll(statusArgs: StatusArgs): TodoEntity[] {
    const { status } = statusArgs;
    if (status !== undefined)
      return this.todos.filter((todo) => todo.done === status);

    return this.todos;
  }

  findOne(id: number): TodoEntity {
    const todo = this.todos.find((todo) => todo.id === id);

    if (!todo) throw new NotFoundException(`Todo with id ${id} not found`);

    return todo;
  }

  create(createTodoInput: CreateTodoInput): TodoEntity {
    const todo = new TodoEntity();
    todo.description = createTodoInput.description;
    todo.id = Math.max(...this.todos.map((todo) => todo.id), 0) + 1;

    this.todos.push(todo);

    return todo;
  }

  update(id: number, updateTodoInput: UpdateTodoInput) {
    const { description, done } = updateTodoInput;
    const todoToUpdate = this.findOne(id);

    if (description) todoToUpdate.description = description;
    if (done !== undefined) todoToUpdate.done = done;

    this.todos = this.todos.map((todo) => {
      return todo.id === id ? todoToUpdate : todo;
    });

    return todoToUpdate;
  }

  delete(id: number): boolean {
    const todo = this.findOne(id);

    this.todos = this.todos.filter((todo) => todo.id !== id);

    return true;
  }
}
