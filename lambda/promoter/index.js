import {Promoter} from 'lsd-storage'
import Books from '../../main/js/model/Books'

export var handler = Promoter.createLambdaHandler("data", new Books(), "reactbooks", "main")
