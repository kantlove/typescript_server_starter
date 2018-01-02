import { BaseError } from '../common/error'
export interface Identity {
  readonly id: number
}

export interface BaseModel extends Identity {}

export class ModelNotFound extends BaseError {
  constructor(modelName: string = '') {
    super(`${modelName} model is not found`)
  }
}

export class ModelAlreadyExists extends BaseError {
  constructor(modelName: string = '') {
    super(`${modelName} model already exists`)
  }
}
