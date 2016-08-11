export default class NotEmpty {

    validate(entity, value) {
        if (!this.isValid(entity, value)) {
            return this.description()
        }
    }

    isValid(entity, value) {
        return value !== undefined && value !== null && value !== ""
    }

    description() {
        return "Must not be empty"
    }
}

