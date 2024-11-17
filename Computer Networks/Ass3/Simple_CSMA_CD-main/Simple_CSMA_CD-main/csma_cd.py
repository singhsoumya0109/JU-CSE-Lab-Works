# import matplotlib.pyplot as plt
import random


class Channel:
    def __init__(self, bandwidth, Tp):
        self.bandwidth = bandwidth
        self.Tp = Tp
        self.busy = False
        self.current_station = None
        self.busy_delay = 0
        self.finish_delay = 0


class Station:
    def __init__(self, ID, frame_size, channel, p):
        self.ID = ID
        self.frame_size = frame_size
        self.channel = channel
        self.p = p
        self.ready = True
        self.waiting_period = 0
        self.drop_period = 0
        self.k = 0
        self.jamming = False
        self.count = 0
        self.interrupted = 0
        self.dropped = 0
        self.sending = False

    def exponential_backoff(self):
        if self.k < 15:
            self.k += 1
            self.waiting_period = random.randint(0, 2 ** self.k - 1)
        else:
            self.k = 0
            self.drop_period = 5
            self.dropped += 1

    def p_persistence(self):
        if self.sending:
            return False
        elif self.drop_period > 0:
            self.drop_period -= 1
            return False
        elif self.waiting_period == 0 and not self.channel.busy:
            if random.random() < self.p:
                return True
            else:
                return False
        elif self.waiting_period > 0:
            self.waiting_period -= 1
            return False
        else:
            self.exponential_backoff()

    def interrupt(self):
        self.channel.busy_delay = 0
        self.channel.current_station = None
        self.jamming = True
        self.sending = False
        self.exponential_backoff()
        self.interrupted += 1


def simulate(stations, channel, time):
    time_slots = time * 1000

    with open('log.txt', 'w') as log:
        while time_slots > 0:
            jamming = False
            for _, station in stations.items():
                if station.jamming:
                    jamming = True
                    log.write(f"Jamming by {station.ID}\n")
                    station.jamming = False
                    break

            if jamming:
                time_slots -= 1
                continue

            if not channel.busy:
                if channel.busy_delay > 0:
                    channel.busy_delay -= 1
                if channel.finish_delay > 0:
                    channel.finish_delay -= 1

                if channel.busy_delay == 0 and channel.current_station:
                    channel.busy = True
                    log.write("Busy bit enabled")

                ready = []
                for _, station in stations.items():
                    if station.p_persistence():
                        ready.append(station)

                if channel.current_station is None and len(ready) == 1:
                    channel.busy_delay = channel.Tp
                    channel.finish_delay = ready[0].frame_size // channel.bandwidth
                    channel.current_station = ready[0].ID
                    ready[0].sending = True
                    log.write(f"{ready[0].ID} started sending\n")

                elif ready:
                    if channel.current_station:
                        log.write(f"{channel.current_station} interrupted. ")
                        stations[channel.current_station].interrupt()
                    log.write("Exponential backoffs performed by: ")
                    for station in ready:
                        station.exponential_backoff()
                        log.write(f"{station.ID} ")
                    log.write("\n")
                else:
                    log.write(".\n")
            else:
                if channel.finish_delay > 0:
                    channel.finish_delay -= 1

                if channel.finish_delay == 0:
                    stations[channel.current_station].count += 1
                    stations[channel.current_station].sending = False
                    stations[channel.current_station].drop_period = 1
                    channel.current_station = None
                    channel.busy = False
                    log.write("Transmission successful. Busy bit disabled\n")
                else:
                    log.write(".\n")

            time_slots -= 1


channel = Channel(bandwidth=1000, Tp=5)
P = 0.33
stations = {
    "A": Station(ID="A", frame_size=1200, channel=channel, p=P),
    "B": Station(ID="B", frame_size=1200, channel=channel, p=P),
    "C": Station(ID="C", frame_size=1200, channel=channel, p=P)
}


# Your data collection logic
times = []
avgs = []

for i in range(1, 150, 1):
    time = i / 10
    simulate(stations, channel, time=time)
    avg = 0
    for id, station in stations.items():
        avg += station.count
    times.append(time)
    avgs.append(avg / (time * 3))



# import random


# class Channel:
#     def __init__(self, bandwidth, propagation_delay):
#         self.bandwidth = bandwidth
#         self.propagation_delay = propagation_delay
#         self.is_busy = False
#         self.active_station = None
#         self.busy_timer = 0
#         self.finish_timer = 0


# class Station:
#     def __init__(self, station_id, frame_size, channel, persistence_probability):
#         self.station_id = station_id
#         self.frame_size = frame_size
#         self.channel = channel
#         self.persistence_probability = persistence_probability
#         self.transmission_ready = True
#         self.backoff_timer = 0
#         self.recovery_timer = 0
#         self.backoff_stage = 0
#         self.is_jamming = False
#         self.transmission_attempts = 0
#         self.interruptions = 0
#         self.dropped_frames = 0
#         self.is_transmitting = False

#     def calculate_backoff(self):
#         if self.backoff_stage < 15:
#             self.backoff_stage += 1
#             self.backoff_timer = random.randint(0, 2 ** self.backoff_stage - 1)
#         else:
#             self.backoff_stage = 0
#             self.recovery_timer = 5
#             self.dropped_frames += 1

#     def check_persistence(self):
#         if self.is_transmitting:
#             return False
#         elif self.recovery_timer > 0:
#             self.recovery_timer -= 1
#             return False
#         elif self.backoff_timer == 0 and not self.channel.is_busy:
#             return random.random() < self.persistence_probability
#         elif self.backoff_timer > 0:
#             self.backoff_timer -= 1
#             return False
#         else:
#             self.calculate_backoff()

#     def interrupt_transmission(self):
#         self.channel.busy_timer = 0
#         self.channel.active_station = None
#         self.is_jamming = True
#         self.is_transmitting = False
#         self.calculate_backoff()
#         self.interruptions += 1


# def simulate_transmission(stations, channel, duration):
#     time_steps = int(duration * 1000)

#     with open('log.txt', 'w') as log_file:
#         while time_steps > 0:
#             jamming_detected = False
#             for station in stations.values():
#                 if station.is_jamming:
#                     jamming_detected = True
#                     log_file.write(f"Jamming detected by Station {station.station_id}\n")
#                     station.is_jamming = False
#                     break

#             if jamming_detected:
#                 time_steps -= 1
#                 continue

#             if not channel.is_busy:
#                 manage_channel_timers(channel)
#                 ready_stations = [s for s in stations.values() if s.check_persistence()]

#                 if channel.active_station is None and len(ready_stations) == 1:
#                     initiate_transmission(channel, ready_stations[0], log_file)
#                 elif ready_stations:
#                     handle_collision(channel, ready_stations, stations, log_file)
#                 else:
#                     log_file.write(".\n")
#             else:
#                 handle_active_transmission(channel, stations, log_file)

#             time_steps -= 1


# def manage_channel_timers(channel):
#     if channel.busy_timer > 0:
#         channel.busy_timer -= 1
#     if channel.finish_timer > 0:
#         channel.finish_timer -= 1
#     if channel.busy_timer == 0 and channel.active_station:
#         channel.is_busy = True


# def initiate_transmission(channel, station, log_file):
#     channel.busy_timer = channel.propagation_delay
#     channel.finish_timer = station.frame_size // channel.bandwidth
#     channel.active_station = station.station_id
#     station.is_transmitting = True
#     log_file.write(f"Station {station.station_id} began transmission\n")


# def handle_collision(channel, ready_stations, stations, log_file):
#     if channel.active_station:
#         log_file.write(f"Station {channel.active_station} was interrupted. ")
#         stations[channel.active_station].interrupt_transmission()
#     log_file.write("Stations performing backoff: ")
#     for station in ready_stations:
#         station.calculate_backoff()
#         log_file.write(f"{station.station_id} ")
#     log_file.write("\n")


# def handle_active_transmission(channel, stations, log_file):
#     if channel.finish_timer > 0:
#         channel.finish_timer -= 1
#     if channel.finish_timer == 0:
#         complete_transmission(channel, stations, log_file)
#     else:
#         log_file.write(".\n")


# def complete_transmission(channel, stations, log_file):
#     stations[channel.active_station].transmission_attempts += 1
#     stations[channel.active_station].is_transmitting = False
#     stations[channel.active_station].recovery_timer = 1
#     channel.active_station = None
#     channel.is_busy = False
#     log_file.write("Transmission completed. Channel is now free\n")


# # Channel and Stations Setup
# network_channel = Channel(bandwidth=1000, propagation_delay=5)
# persistence_prob = 0.33
# network_stations = {
#     "A": Station(station_id="A", frame_size=12000, channel=network_channel, persistence_probability=persistence_prob),
#     "B": Station(station_id="B", frame_size=12000, channel=network_channel, persistence_probability=persistence_prob),
#     "C": Station(station_id="C", frame_size=12000, channel=network_channel, persistence_probability=persistence_prob)
# }

# # Simulation Data Collection
# times = []
# average_transmissions = []

# for i in range(1, 150, 1):
#     current_time = i / 10
#     simulate_transmission(network_stations, network_channel, duration=current_time)
#     avg_count = sum(station.transmission_attempts for station in network_stations.values())
#     times.append(current_time)
#     average_transmissions.append(avg_count / (current_time * 3))
