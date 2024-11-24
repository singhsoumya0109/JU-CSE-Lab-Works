#include <iostream>
#include <pthread.h>
#include <semaphore.h>
#include <unistd.h>
#include <cstdlib>
using namespace std;
sem_t resource;      // Semaphore for writer access
sem_t rcount_access; // Semaphore to control access to read count
int read_count = 0;  // Number of active readers
void *reader(void *param)
{
    int id = *(int *)param;
    while (true)
    {
        sem_wait(&rcount_access); // Wait for access to read count
        read_count++;
        if (read_count == 1)
        {
            sem_wait(&resource); // First reader locks resource
        }
        sem_post(&rcount_access); // Release access to read count
        // Reading section
        cout << "Reader " << id << " is reading" << endl;
        sleep(rand() % 2);        // Simulate read time
        sem_wait(&rcount_access); // Wait for access to read count
        read_count--;
        if (read_count == 0)
        {
            sem_post(&resource); // Last reader releases resource
        }
        sem_post(&rcount_access); // Release access to read count
        sleep(rand() % 3);        // Simulate wait before trying to read again
    }
    pthread_exit(0);
}
void *writer(void *param)
{
    int id = *(int *)param;
    while (true)
    {
        sem_wait(&resource); // Wait until no readers or other writers are
        using the resource
                // Writing section
                cout
            << "Writer " << id << " is writing" << endl;
        sleep(rand() % 2);   // Simulate write time
        sem_post(&resource); // Release access for readers and other writers
        sleep(rand() % 3);   // Simulate wait before trying to write again
    }
    pthread_exit(0);
}
int main()
{
    srand(time(nullptr));
    pthread_t readers[5], writers[3];
    int reader_ids[5], writer_ids[3];
    // Initialize semaphores
    sem_init(&resource, 0, 1);
    sem_init(&rcount_access, 0, 1);
    // Create reader threads
    for (int i = 0; i < 5; i++)
    {
        reader_ids[i] = i + 1;
        pthread_create(&readers[i], nullptr, reader, &reader_ids[i]);
    }
    // Create writer threads
    for (int i = 0; i < 3; i++)
    {
        writer_ids[i] = i + 1;
        pthread_create(&writers[i], nullptr, writer, &writer_ids[i]);
    }
    // Join threads (though with infinite loops, this will not terminate)
    for (int i = 0; i < 3; i++)
    {
        pthread_join(writers[i], nullptr);
    }
    for (int i = 0; i < 5; i++)
    {
        pthread_join(readers[i], nullptr);
    }
    // Cleanup semaphores
    sem_destroy(&resource);
    sem_destroy(&rcount_access);
    return 0;
}