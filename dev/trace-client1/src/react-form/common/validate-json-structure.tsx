import { builtinValidators } from './builtin-item-level-validators'
import { getArtifacts } from './react-form-hook'
const errors = {
    unspecified: 'Unspecified error while parsing',
    missingType: `One or more 'type' tags are missing`,
    invalidType: `One or more 'type' tags have invalid values`,
    noPatternInRange: `One of the Range elements is not having pattern tag`,
    noNameTag: `One or more 'name' tags are missing`,
    validationsShouldBeRange: `validations tag should be of range type`,
    noItems: `One or more item has missing 'items' tag`,
    itemsShouldBeRange: `The 'items' tag should be of range type`,
    invalidValidator: `One or more validators in the 'name' tag of 'validations' do not exist`,
}

let types: string[] = []
const actionElements: string[] = ['Button', 'Submit']
let allValidators: string[] = []
function validateJsonStructure(
    id: string,
    formJson: any,
    componentStore: any,
    entityName: string
) {
    types = [...Object.keys(componentStore), 'Set', 'Range']
    if (getArtifacts(entityName)) {
        allValidators = [
            ...Object.keys(builtinValidators),
            ...Object.keys(getArtifacts(entityName).itemLevelValidators),
            ...Object.keys(getArtifacts(entityName).setLevelValidators),
            ...Object.keys(getArtifacts(entityName).formLevelValidators),
        ]
    } else {
        allValidators = [...Object.keys(builtinValidators)]
    }
    try {
        let err = ''
        err = checkItems(formJson)
        return err
    } catch (error) {
        return errors['unspecified']
    }
}

function checkItems(item: any) {
    let err = ''
    if (item.items) {
        if (Array.isArray(item.items)) {
            for (let it of item.items) {
                err = checkItem(it)
                if (err) break
            }
        } else {
            err = errors['itemsShouldBeRange']
        }
    } else if (item.type === 'set') {
        err = errors['noItems']
    } else {
        err = errors['noItems']
    }
    return err
}

function checkItem(item: any) {
    let err = ''
    err = checkType(item)
    if (!err) {
        err = checkName(item)
        if (!err) {
            err = checkValidations(item)
            if (!err) {
                if (item.type === 'Range') {
                    err = checkRange(item)
                } else if (item.type === 'set') {
                    err = checkSet(item)
                }
            }
        }
    }
    return err
}

function checkSet(item: any) {
    let err = ''
    err = checkName(item)
    if (!err) {
        err = checkItems(item)
    }
    return err
}

function checkRange(item: any) {
    let err = ''
    if (item.pattern) {
        err = checkPattern(item.pattern)
    } else {
        err = errors['noPatternInRange']
    }
    return err
}

function checkName(item: any) {
    let err = ''
    if (!item.name) {
        if (!actionElements.includes(item.type)) {
            err = errors['noNameTag']
        }
    }
    return err
}

function checkValidations(item: any) {
    let err = ''
    if (item.validations) {
        if (Array.isArray(item.validations)) {
            if (item.validations.length > 0) {
                for (let v of item.validations) {
                    if (!allValidators.includes(v.name)) {
                        err = errors['invalidValidator']
                        break
                    }
                }
            }
        } else {
            err = errors['validationsShouldBeRange']
        }
    }
    return err
}

function checkType(item: any) {
    const type = item.type
    let err = ''
    if (type) {
        if (!types.includes(type)) {
            err = errors['invalidType']
        }
    } else {
        err = errors['missingType']
    }
    return err
}

function checkPattern(pattern: any) {
    let err = ''
    err = checkName(pattern)
    if (!err) {
        err = checkItems(pattern)
    }
    return err
}

export { validateJsonStructure }
