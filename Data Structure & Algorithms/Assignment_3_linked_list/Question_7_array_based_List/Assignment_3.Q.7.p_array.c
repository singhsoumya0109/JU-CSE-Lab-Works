#include<stdio.h>
#include<stdlib.h>
#include<math.h>

struct node{
    int info;
    int next;
};
struct List{                     //structure of linked list in form of array.
    int size;
    struct node *array;
};

struct List *create_list(int V){                //creating a List of array size V;
    struct List *newlist = (struct List*)malloc(sizeof(struct List));
    newlist->size = -1;
    newlist->array = (struct node*)malloc(V*sizeof(struct node));
    return newlist;
}

void insert(struct List *l,int data){           //function for inserting key.
    l->array[l->size+1].info = data;
    if(l->size == -1)
       l->array[l->size+1].next = -1;
    else
        l->array[l->size+1].next = l->array[l->size].info;     /*storing the next info of
                                                            previous info in next field of current List array.*/
    l->size++;              //incrementing the list size by 1.
}


void print_list(struct List *l){        //function to print the list.
    if(l->size == -1){              //case of an empty list.

        printf("The list is empty.\n");
        return;
    }
    int i=0;
    struct node *a = l->array;
    while(i <= l->size){
        printf("->%d",a[i].info);
        i++;
    }
    printf("\n");
}

void swap(int *a,int* b){       //swapping function.
    int temp;
    temp = *a;
    *a = *b;
    *b = temp;
}

void reverse_list(struct List *l){          //function for reversing the list.
    int i=0,j=l->size;
    while(i < l->size/2+1 ){
        swap(&l->array[i].info,&l->array[j].info);
        if(i != 0)
            l->array[i].next = l->array[j].info;
        else
            l->array[i].next = -1;
        l->array[j].next = l->array[i+1].info;
        j--;
        i++;
    }

}

int main(){
    struct List *list = create_list(12);
    insert(list,9);
    insert(list,34);
    insert(list,5);
    insert(list,1);
    insert(list,4);
    insert(list,25);
    insert(list,10);
    printf("The linked list is:\n\t");
    print_list(list);

    reverse_list(list);
    printf("\nThe list after reversing the original list is:\n\t");
    print_list(list);
    return 0;
}
