import socket

def xor1(a, b):
    result = ""
    for i in range(1, len(b)):
        result += "0" if a[i] == b[i] else "1"
    return result

def mod2div(dividend, divisor):
    pick = len(divisor)
    tmp = dividend[:pick]
    
    while pick < len(dividend):
        if tmp[0] == '1':
            tmp = xor1(divisor, tmp) + dividend[pick]
        else:
            tmp = xor1('0'*len(divisor), tmp) + dividend[pick]
        pick += 1
    
    if tmp[0] == '1':
        tmp = xor1(divisor, tmp)
    else:
        tmp = xor1('0'*len(divisor), tmp)
    
    return tmp.lstrip('0')  # Return only the remainder part

def receiver(data, key):
    calculated_remainder = mod2div(data, key)
    if calculated_remainder == '':
        return True, data[:-(len(key) - 1)]  # No error
    else:
        return False, data[:-(len(key) - 1)]  # Error

def main():
    host = 'localhost'
    port = 12345
    
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.bind((host, port))
        s.listen(1)
        print("Waiting for a connection...")
        conn, addr = s.accept()
        with conn:
            print(f"Connected by {addr}")
            received_message = conn.recv(1024).decode()
            
            # Split the received message into key and codeword
            key, received_data = received_message.split(" ", 1)
            
            is_correct, original_data = receiver(received_data, key)
            
            if is_correct:
                print("No Error")
            else:
                print("Error")
            print("Received Data: ", original_data)

if __name__ == '__main__':
    main()
