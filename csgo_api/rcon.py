from decouple import config
from valve import rcon

class Client:
    __ip_address = config("IP_ADDRESS")
    __csgo_port = int(config("CSGO_PORT"))
    __password = config("PASSWORD")
    __server_address = (__ip_address, __csgo_port)

    def send_command(self, command: str) -> str:
        response = rcon.execute(self.__server_address, self.__password, command)
        return response