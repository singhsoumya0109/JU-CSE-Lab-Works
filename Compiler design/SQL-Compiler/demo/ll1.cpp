void computeLL1Table() {
    for (const auto& [A, productions] : grammar) {
        for (const auto& rhs : productions) {
            // Compute FIRST(rhs)
            unordered_set<string> firstSet;
            bool derivesEpsilon = true;
            for (const string& sym : rhs) {
                if (isTerminal(sym)) {
                    firstSet.insert(sym);
                    derivesEpsilon = false;
                    break;
                } else {

                    for (const string& f : FIRST[sym]) {
                        if (f != "ε") firstSet.insert(f);
                    }
                    if (FIRST[sym].find("ε") == FIRST[sym].end()) {
                        derivesEpsilon = false;
                        break;
                    }
                }
            }
            if (derivesEpsilon) firstSet.insert("ε");
            // Add A → rhs to table for all terminals in FIRST(rhs)
            for (const string& t : firstSet) {
                if (t != "ε")
                    table[A][t] = rhs;
            }
            // If ε ∈ FIRST(rhs), add A → rhs for all t ∈ FOLLOW(A)
            if (firstSet.find("ε") != firstSet.end()) {
                for (const string& t : FOLLOW[A]) {
                    table[A][t] = rhs;
                }
            }
        }
    }
}


/*So here’s the function computeLL1Table, which is used to build the LL(1) parsing table using the grammar, the FIRST sets, and the FOLLOW sets.

We start by iterating over each non-terminal in our grammar. For each non-terminal, say A, we go through all its productions — that is, all the different right-hand sides for A.

Now, for each production A → α, we want to compute FIRST(α). To do that, we initialize an empty set called firstSet, and a boolean derivesEpsilon which is initially set to true. This flag will help us check whether the entire right-hand side can derive ε.

We then go through each symbol in the RHS from left to right. If we encounter a terminal, we add it to our firstSet, mark derivesEpsilon as false — since a terminal can't derive ε — and then we break out of the loop because we’ve found the first terminal.

If we encounter a non-terminal, we add all the elements from its FIRST set into our firstSet, excluding ε. If ε is not in the FIRST set of this symbol, that means this symbol can’t derive ε, so we set derivesEpsilon to false and break.

However, if all the symbols in the RHS can derive ε, then we insert ε into the firstSet as well.

Now we use this firstSet to fill the parsing table. For every terminal in firstSet (except ε), we add the production A → α into table[A][terminal].

Finally, if ε is in the firstSet, that means A → α can derive ε. So, for every terminal in the FOLLOW set of A, we also insert this production into table[A][terminal].

In short, this function uses both FIRST and FOLLOW sets to correctly populate the LL(1) table, ensuring we know which production to use based on the current input symbol and the top of the stack.
*/