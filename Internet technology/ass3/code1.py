from scapy.all import IP, ICMP, sr1
import sys

def trace_route(destination_ip, max_hops=30):
    print(f"Tracing route to {destination_ip} with a maximum of {max_hops} hops:\n")
    for ttl in range(1, max_hops + 1):
        packet = IP(dst = destination_ip, ttl = ttl) / ICMP()
        response = sr1(packet, timeout = 1, verbose = False)
        if response is None:
            print(f"{ttl}: *")
        else:   
            print(f"{ttl}: {response.src}")

            if response.type == 0: # ICMP Echo Reply
                print(f"Destination reached!")
                break

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python trace_route.py <destination_ip>")
        sys.exit(1)

    destination_ip = sys.argv[1]
    trace_route(destination_ip)
