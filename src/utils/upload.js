import * as qiniu from 'qiniu-js'
import * as UploadApi from '@/api/upload'

export async function upload (file, key, observer) {
    const { next, error, complete } = observer
    const resp = await UploadApi.getToken()
    if (!resp.success) {
        error(resp)
        return
    }

    const observable = qiniu.upload(file, key, resp.data)

    const subscription = observable.subscribe(next, error, complete)

    return subscription
}
