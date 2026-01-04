import { AnyAction, isRejected, isRejectedWithValue, Middleware, MiddlewareAPI } from '@reduxjs/toolkit'
import { toast } from 'react-toastify'
import { isEntityError } from 'utils/helper'

function isPayloadErrorMessage(payload: unknown): payload is {
  data: {
    error: string
  }
  status: number
} {
  return (
    typeof payload === 'object' &&
    payload !== null &&
    'data' in payload &&
    typeof (payload as any).data?.error === 'string'
  )
}

export const rtkQueryErrorLogger: Middleware = (api: MiddlewareAPI) => (next) => (action: AnyAction) => {
  /**
   * `isRejectedWithValue` là một function giúp ta kiểm tra những action có rejectedWithValue = true từ createAsyncThunk
   * RTK Query sử dụng `createAsyncThunk` bên trong nên chúng ta có thể dùng `isRejectedWithValue` để kiểm tra lỗi
   */
  if (isRejected(action)) {
    if (action.error.name === 'CustomeError') {
      // Những lỗi liên quan đến quá trình thực thi
      toast.warn(action.error.message)
    }
    // if (!isEntityError(action.payload)) {
    //   // lỗi còn lại trừ lỗi 422: có thể là từ serializedError
    //   toast.warn(action.error.message)
    // }
  }
  // lỗi reject từ server chỉ có message thôi!
  if (isRejectedWithValue(action)) {
    if (isPayloadErrorMessage(action.payload)) {
      toast.warn(action.payload.data.error)
    }
  }
  return next(action)
}
