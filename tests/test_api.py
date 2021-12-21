from csgo_api.main import app
import unittest

class APITestCase(unittest.TestCase):
    def setUp(self):
        self.app = app
        self.app.config['TESTING'] = True
        self.client = self.app.test_client()

    def test_send_command(self):
        data: dict = {
            "command": "status"
        }

        response = self.client.post('/send-command', json=data)

        self.assertEqual(response.status_code, 200)
        self.assertIn("hostname", str(response.data))

if __name__ == "__main__":
    unittest.main()