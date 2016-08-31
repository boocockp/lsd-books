import {Promoter} from 'lsd-storage'
import Books from '../../main/js/model/Books'

exports.handler = Promoter.createLambdaHandler("data", new Books(), "reactbooks", "main")
