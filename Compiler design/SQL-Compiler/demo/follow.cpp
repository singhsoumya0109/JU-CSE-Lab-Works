void computeFollow() {
    follow[start].insert("$");  // Step 1: Add $ to FOLLOW(start symbol)
    bool changed;
    do {
        changed = false;
        for (auto& [A, productions] : grammar) {
            for (auto& rhs : productions) {
                for (int i = 0; i < rhs.size(); ++i) {
                    if (isNonTerminal(rhs[i])) {
                        auto B = rhs[i];
                        bool addFollowA = true;
                        // Step 2: Check symbols after B in the production A -> α B β
                        for (int j = i + 1; j < rhs.size(); ++j) {
                            if (isTerminal(rhs[j])) {
                                // Add terminal to FOLLOW(B)
                                changed |= follow[B].insert(rhs[j]).second;
                                addFollowA = false;
                                break;

                            } else {
                                auto C = rhs[j];
                                // Add FIRST(C) excluding ε to FOLLOW(B)
                                for (auto& t : first[C]) {
                                    if (t != "#")
                                        changed |= follow[B].insert(t).second;
                                }
                                if (!first[C].count("#")) {
                                    addFollowA = false;
                                    break;
                                }
                            }
                        }
                        // Step 3: If β is empty or derives ε, add FOLLOW(A) to FOLLOW(B)
                        if (addFollowA) {
                            for (auto& t : follow[A])
                                changed |= follow[B].insert(t).second;
                        }
                    }
                }
            }
        }
    } while (changed);  // Repeat until no new changes
}


/*This function computeFollow() builds the FOLLOW sets for all non-terminal symbols in the grammar. FOLLOW sets are essential for building the LL(1) parsing table, especially when productions can derive epsilon.

We begin by inserting the dollar symbol $ into the FOLLOW set of the start symbol. This represents the end of input and is a standard step in constructing FOLLOW sets.

Next, we use a loop that continues until no more changes are made to any FOLLOW set. This is done using a do-while loop with a changed flag. If any new element is added to any FOLLOW set in one iteration, we repeat the process.

Inside the loop, we go through every production rule in the grammar. For each non-terminal A, we go through each of its productions, and for each symbol on the right-hand side, we check if it is a non-terminal.

If it is a non-terminal, say B, we then look at all the symbols after B in the production — we denote that as β in the production A → α B β.

If the symbol after B is a terminal, we simply add it to FOLLOW(B) — this is straightforward, as terminals directly follow B in that case.

However, if the symbol following B is a non-terminal, say C, then we add everything from FIRST(C) — excluding epsilon — to FOLLOW(B), because those are the possible starting terminals of the β part.

Now, if FIRST(C) contains epsilon, that means C can disappear, so we have to continue checking the next symbol in β. If none of the remaining symbols in β produce anything other than epsilon, we set a flag addFollowA to true.

After we finish scanning all symbols following B, we check the addFollowA flag. If it's true, it means that either there was nothing after B, or all of the following symbols can derive ε — in both cases, we must add FOLLOW(A) to FOLLOW(B), based on the standard grammar rule.

The changed flag is updated every time a new terminal is inserted into a FOLLOW set. As long as we keep making changes, the outer loop continues.

Once there are no more changes, the FOLLOW sets are complete.

*/