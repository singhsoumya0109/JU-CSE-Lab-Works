import socket

def ones_complement(data):
    """ Function to find the One's complement of the given binary string """
    return ''.join('1' if bit == '0' else '0' for bit in data)

def checksum(data, block_size):
    """ Function to return the checksum value of the given string when divided into block_size blocks """
    n = len(data)
    
    # Pad the data so that its length is a multiple of block_size
    if n % block_size != 0:
        pad_size = block_size - (n % block_size)
        data = '0' * pad_size + data

    # Binary addition of all blocks with carry
    result = data[:block_size]

    for i in range(block_size, len(data), block_size):
        next_block = data[i:i + block_size]
        
        # Perform binary addition of result and next_block
        additions = ""
        sum_val = 0
        carry = 0

        for j in range(block_size - 1, -1, -1):
            sum_val = int(result[j]) + int(next_block[j]) + carry
            if sum_val == 0:
                additions = '0' + additions
                carry = 0
            elif sum_val == 1:
                additions = '1' + additions
                carry = 0
            elif sum_val == 2:
                additions = '0' + additions
                carry = 1
            else:  # sum_val == 3
                additions = '1' + additions
                carry = 1

        # If there's a carry, add it
        if carry == 1:
            final = ""
            for k in range(block_size - 1, -1, -1):
                if carry == 0:
                    final = additions[k] + final
                else:
                    sum_val = int(additions[k]) + carry
                    if sum_val == 2:
                        final = '0' + final
                        carry = 1
                    else:
                        final = str(sum_val) + final
                        carry = 0
            result = final
        else:
            result = additions

    # Return One's complement of result value
    return ones_complement(result)

def main():
    # Network configuration
    host = 'localhost'
    port = 12345
    block_size = 8
    
    # Create socket
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.bind((host, port))
        s.listen(1)
        print("Waiting for a connection...")
        conn, addr = s.accept()
        with conn:
            print(f"Connected by {addr}")
            received_data = conn.recv(1024).decode().split('\n')
            data = received_data[0]
            received_checksum = received_data[1]
            
            # Compute checksum of the received data
            computed_checksum = checksum(data, block_size)
            
            # Compare with received checksum
            if computed_checksum == received_checksum:
                print("No Error")
            else:
                print("Error")
            print("Received Data: ", data)

if __name__ == '__main__':
    main()
