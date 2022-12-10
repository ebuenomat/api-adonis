import {v4 as uuidv4 } from 'uuid'

import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Store from 'App/Models/Store'

import  Application  from '@ioc:Adonis/Core/Application'

export default class StoresController {
    private validationOptions = {
        types: ['image'],
        size: '2mb'
    }

    public async store({ request, response }: HttpContextContract) {
        
        const body = request.body() //pega todos os dados que vieram da requisição

        const image = request.file('image', this.validationOptions)

        if(image) {
            const imageName = `${uuidv4()}.${image.extname}`
            await image.move(Application.tmpPath('uploads'), {
                name: imageName
            })

            body.image = imageName
        }

        const item = await Store.create(body)

        response.status(201)

        return {
            message: "Item criado com sucesso",
            data: item,
        }
    }

    public async index() {
        const stores = await Store.query().preload('comments')

        return {
            data: stores,
        }
    }

    public async show({params}: HttpContextContract) {
        const store = await Store.findOrFail(params.id)

        await store.load('comments')

        return {
            data: store,
        }
    }

    public async destroy({params}: HttpContextContract) {
        const store = await Store.findOrFail(params.id)

        await store.delete()

        return {
            message: 'Item excluído com sucesso',
            data: store,
        }
    }

    public async update({params, request}: HttpContextContract) {
        const body = request.body()

        const store = await Store.findOrFail(params.id)

        store.title = body.title
        store.description = body.description

        if (store.image != body.image || !store.image) {
            const image = request.file('image', this.validationOptions)

            if(image) {
                const imageName = `${uuidv4()}.${image.extname}`

                await image.move(Application.tmpPath('uploads'), {
                 name: imageName
             })
     
                 store.image = imageName
            }
        }

        await store.save()

        return {
            message: 'Item atualizado com sucesso',
            data: store,
        }
    }
}
