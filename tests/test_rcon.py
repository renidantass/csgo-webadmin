from csgo_api.rcon import Client
import unittest

class RCONTestCase(unittest.TestCase):
    def setUp(self):
        self.client: Client = Client()

    def test_send_command(self):
        command_response: str = self.client.send_command("status")
        self.assertIn("hostname", command_response)

if __name__ == "__main__":
    unittest.main()