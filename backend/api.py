from flask import Flask, request, Response
from flask_cors import CORS, cross_origin
import time
import json
from uuid import uuid4 as u
from functools import wraps
from flask import request
import os
app = Flask(__name__)
CORS(app)

class Unauthorized(Exception):
    pass
class UserData():
    
    @classmethod
    def add_new_user(self, username):
        id = u().hex
        print(id)
        with open(f"./backend/users/{id}.json", 'x', encoding="utf-8") as f:
            data = {
                "username": username,
                "id": id,
                "token": u().hex,
                "user_data": {
                    "owned_units": [],
                    "gold": 0
                }
            }
            f.write(json.dumps(data))
            time.sleep(1)
            return data
    @classmethod
    def get_user_data(self, id):
        data = None
        with open(f"./backend/users/{id}.json", 'r', encoding='utf-8') as f:
            data = json.load(f)
        print(data)
        return data
        
    @classmethod
    def update_user_data(self, id, token, playerData):
        print("before withw")
        text = None
        with open(f"./backend/users/{id}.json", 'r+', encoding="utf-8") as f:
            print("I am printing")
            text = f.read()
        with open(f"./backend/users/{id}.json", 'w', encoding="utf-8") as f:
            data2 = {
                "username": playerData['username'],
                "id": id,
                "token": token,
                "user_data": playerData['user_data']
            
            }
            print(data2)
            print("about to load data PELASE")
            
            print("File: " + text)
            data = None
            try:
                data = json.loads(text, strict=False)
            except json.JSONDecodeError as e:
                print(e)
            print("about to get to if statement")
            print(data['token'])
            
            if data['token'] == token:
                print("NEW DATA")
                print(json.dumps(data2))
                json.dump(data2, f)
                return data2, 201
            else:
                print("UNAUTHORIZED")

                
    
@app.route("/add-new-user", methods=["POST"])
@cross_origin()
def add_new_user():
    username = request.json['username']
    data = UserData.add_new_user(username)
    return json.dumps(data), 201

@app.route("/get-user-data", methods=["GET"])
def get_user_data():
    id = request.args['id']
    data = UserData.get_user_data(id)
    del data['token'] ##dont give out user tokens
    return data, 200

@app.route("/update-user-data", methods=["POST"])
def update_user_data():
    playerData = request.json
    token = request.args['token']
    print(playerData)
    id = playerData['id']
    print('before')
    data = UserData.update_user_data(id, token, playerData)
    print("after")
    return data, 200

def run():
    app.run(host="0.0.0.0",  port=5000)
if __name__ == '__main__':
    run()
