from flask import Flask, json, jsonify, request
from flask_restful import reqparse, abort, Api, Resource
from flask_cors import CORS
from rcon import Client

app = Flask(__name__)
cors = CORS(app, resources={r"*": {"origins": "*"}})
api = Api(app)
rcon_client = Client()


def throw_none_if_no_command_or_just_return_command(json_data):
    try:
        return json_data["command"]
    except KeyError:
        return None

class Command(Resource):
    def post(self):
        json_data = request.get_json(force=True)
        command = throw_none_if_no_command_or_just_return_command(json_data)

        if (command is not None) and (len(command) > 0):
            response = rcon_client.send_command(command)
            return { "message": response }
        else:
            return {
                "message": "Especifique ao menos um comando, caso seja mais de um, coloque-os separado por ponto e vírgula"
            }

api.add_resource(Command, '/send-command')

if __name__ == '__main__':
    app.run(debug=True)