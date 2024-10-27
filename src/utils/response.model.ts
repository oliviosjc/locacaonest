import { HttpStatus } from "@nestjs/common";

export class ResponseViewModel<T> 
{
    constructor
    (
      public statusCode: HttpStatus,
      public message?: string,
      public data?: T,
    ) {}
  }