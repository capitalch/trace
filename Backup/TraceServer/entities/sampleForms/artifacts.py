from ariadne import  QueryType, graphql_sync, make_executable_schema, gql, ObjectType, load_schema_from_path
type_defs_sample_forms = load_schema_from_path('entities/sampleForms')
import simplejson as json

type_defs = load_schema_from_path('entities/sampleForms') # loads all schemas recursively

person = ObjectType("Person")
address = ObjectType("Address")
state = ObjectType("State")
city = ObjectType("City")

# @query.field("sampleForms")
def resolve_sample_forms(_,info):
    return {
        "person": get_person(),
        "states": get_states(),
        "cities": get_cities()
    }

def get_person():
    return {"name": "Sushant1", "age": 56, "addresses": get_addresses()}

def get_addresses():
    return [{
        "line1": "abc1",
        "line2": "def",
        "pin": 700013
    }, {
        "line1": "abc2",
        "line2": "def",
        "pin": 700014
    }]

def get_states():
    out = None
    with open('data/india-states.json', 'r') as file:
        out = json.load(file)
    return out

def get_cities():
    out = None
    with open('data/india-cities.json', 'r') as file:
        out = json.load(file)
    return out