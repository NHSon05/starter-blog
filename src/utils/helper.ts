import { FetchBaseQueryError } from '@reduxjs/toolkit/dist/query'

/**
 * Kiểu ErrorFormObject dành cho trường hợp bao quát
 */
interface ErrorFormObject {
  [key: string | number]: string | ErrorFormObject | ErrorFormObject[]
}

interface EntityError {
  status: 422
  data: {
    error: ErrorFormObject
  }
}

/**
 * Phương pháp type predicate dùng để thu hẹp kiểu của 1 biến
 * ✅ đầu tiên chúng ta sẽ khai báo một function check kiểm tra cấu trúc về mặt logic javascript
 * ✅ Tiếp theo chúng ta thêm `parameterName is Type` làm kiểu return của function thay vì boolean
 * ✅ Khi dùng function kiểm tra kiểu này, ngoài việc kiểm tra về mặt logic cấu trúc, nó còn chuyển kiểu
 *
 * So sánh với phương pháp ép kiểu
 */

export function isFetchBaseQueryError(error: unknown): error is FetchBaseQueryError {
  return typeof error === 'object' && error !== null && 'status' in error
}
/**
 * thu hẹp error có kiểu không xác định về 1 object với thuộc tính message: string (SerializedError)
 */

export function isErrorWithMessage(error: unknown): error is { message: string } {
  return typeof error === 'object' && error !== null && 'message' in error && typeof (error as any).message === 'string'
}
/**
 * Thu hẹp một error có kiểu không xác định về lỗi liên quan đến POST PUT không đúng field (EntityError)
 */

export function isEntityError(error: unknown): error is EntityError {
  return (
    isFetchBaseQueryError(error) &&
    error.status === 422 &&
    typeof error.data === 'object' &&
    error.data !== null &&
    !(error.data instanceof Array)
  )
}

export class CustomError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'CustomeError'
  }
}
