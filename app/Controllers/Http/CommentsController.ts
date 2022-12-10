import { Request } from '@adonisjs/core/build/standalone'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Store from 'App/Models/Store'
import Comment from 'App/Models/Comment'

export default class CommentsController {

    public async store({request, params, response}: HttpContextContract) {

        const body = request.body()
        const storeId = params.storeId

        await Store.findOrFail(storeId)

        body.storeId = storeId

        const comment = await Comment.create(body)

        response.status(201)

        return {
            message: "Comentário adicionado com sucesso",
            data: comment
        }
    }
}
