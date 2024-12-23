from flask import Flask, request, jsonify
from scapy.all import ARP, Ether, srp
from flask_cors import CORS


app = Flask(__name__)
CORS(app, origins=['http://127.0.0.1:5500'])
# Function to scan the network
def scan_network(target_ip):
    # Create an ARP request packet (to discover devices on the network)
    arp_request = ARP(pdst=target_ip)
    
    # Broadcast the ARP request using an Ethernet frame
    broadcast = Ether(dst="ff:ff:ff:ff:ff:ff")
    arp_request_broadcast = broadcast/arp_request
    
    # Send the request and receive the responses
    answered_list = srp(arp_request_broadcast, timeout=1, verbose=False)[0]
    
    # List to store the devices found
    devices_list = []
    
    # Process the responses
    for element in answered_list:
        # For each device found, store the IP and MAC address
        device_info = {'ip': element[1].psrc, 'mac': element[1].hwsrc}
        devices_list.append(device_info)
    
    return devices_list

# Route to handle network scan
@app.route('/scan', methods=['POST'])
def scan():
    target_ip = request.json.get('ip_range')
    if not target_ip:
        return jsonify({'error': 'IP range is required'}), 400

    devices = scan_network(target_ip)
    return jsonify({'devices': devices})

if __name__ == '__main__':
    app.run(debug=True)
