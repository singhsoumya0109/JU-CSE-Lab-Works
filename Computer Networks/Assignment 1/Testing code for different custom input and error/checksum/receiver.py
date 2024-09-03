import socket

def ones_complement(data):
    """Function to find the One's complement of the given binary string"""
    return ''.join('1' if bit == '0' else '0' for bit in data)

def checksum(data, block_size):
    """Function to return the checksum value of the given string when divided into block_size blocks"""
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
    block_size = 8  # Block size for checksum calculation
    message = receive_message()
    
    # Split the received data into actual data and checksum
    received_data, received_checksum = message.rsplit(' ', 1)
    
    # Compute checksum for the received data
    calculated_checksum = checksum(received_data, block_size)
    
    # Check if the calculated checksum matches the received checksum
    if calculated_checksum == received_checksum:
        print("No error detected in received data using checksum.")
    else:
        print("Error detected in received data using checksum.")

if __name__ == '__main__':
    main()
