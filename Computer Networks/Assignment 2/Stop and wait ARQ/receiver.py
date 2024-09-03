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

def stop_and_wait_receiver():
    host = 'localhost'
    port = 12345
    block_size = 8

    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    sock.bind((host, port))
    sock.listen(1)
    print("Receiver is listening...")

    conn, addr = sock.accept()
    print(f"Connection established with {addr}")

    while True:
        try:
            data = conn.recv(1024).decode()
            if not data:
                break
            
            # Extract frame and checksum
            frame, received_checksum = data.split('\n')
            
            # Recompute checksum
            computed_checksum = checksum(frame, block_size)
            
            if received_checksum == computed_checksum:
                print("Frame received correctly:", frame)
                conn.sendall("ACK".encode())
            else:
                print("Error detected in frame. Discarding frame.")
                conn.sendall("NACK".encode())
        
        except ConnectionResetError:
            print("Connection lost. Exiting.")
            break

    conn.close()

if __name__ == '__main__':
    stop_and_wait_receiver()
