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
            tmp = xor1('0'*pick, tmp) + dividend[pick]
        pick += 1
    if tmp[0] == '1':
        tmp = xor1(divisor, tmp)
    else:
        tmp = xor1('0'*pick, tmp)
    return tmp

def encodeData(data, key):
    l_key = len(key)
    appended_data = data + '0'*(l_key - 1)
    remainder = mod2div(appended_data, key)
    codeword = data + remainder
    return codeword, remainder

def read_file(filename):
    with open(filename, 'r') as file:
        return file.read().strip()

def main():
    host = 'localhost'
    port = 12345
    key = "10000001001100001011110101000011"  # CRC-32
    
    # Read correct data and erroneous data from files
    correct_data = read_file('sender_data.txt')
    erroneous_data = read_file('text1.txt')
    
    # Encode the correct data using CRC
    codeword, remainder = encodeData(correct_data, key)
    
    # Concatenate the key and the erroneous data, separated by a space
    message = key + " " + erroneous_data
    
    # Send the message
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.connect((host, port))
        s.sendall(message.encode())

if __name__ == '__main__':
    main()
