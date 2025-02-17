%{
    #include <stdio.h>
%}


%%
(b(b|a)*)|(a+b+(a(a|b)*))|a* printf("False");
a+b+   printf("True");
.;
%%

int main(){
    yylex();

    return 0;
}

int yywrap(){
    return 1;
}