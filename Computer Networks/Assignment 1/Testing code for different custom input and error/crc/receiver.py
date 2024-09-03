import socket

def xor1(a, b):
    """XOR operation for binary strings"""
    result = ""
    for i in range(1, len(b)):
        result += "0" if a[i] == b[i] else "1"
    return result

def mod2div(dividend, divisor):
    """Function to perform modulo-2 division"""
    pick = len(divisor)
    tmp = dividend[:pick]
    
    while pick < len(dividend):
        if tmp[0] == '1':
            tmp = xor1(divisor, tmp) + dividend[pick]
        else:
            tmp = xor1('0'*pick, tmp) + dividend[pick]
        pick += 1
    
    if tmp[0] == '1':
        tmp = xor1(divisor, tmp)
    else:
        tmp = xor1('0'*pick, tmp)
    
    return tmp

def receive_message():
    """Function to receive the message over the socket"""
    host = 'localhost'
    port = 12345

    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.bind((host, port))
        s.listen()
        conn, addr = s.accept()
        with conn:
            message = conn.recv(1024).decode().strip()
            return message

def main():
    message = receive_message()
    
    # Split the message into key and data parts
    key, data = message.split(' ', 1)
    
    # Perform CRC check
    remainder = mod2div(data, key)
    
    # Check if the remainder has any '1'
    if '1' in remainder:
        print("Error detected in received data using CRC.")
    else:
        print("No error detected in received data using CRC.")

if __name__ == '__main__':
    main()
