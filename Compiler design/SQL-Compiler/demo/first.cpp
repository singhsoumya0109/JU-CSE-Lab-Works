void Parser::computeFirst() {
    bool changed;
    do {
        changed = false;
        for (const auto& [A, productions] : grammar) {
            for (const auto& rhs : productions) {
                bool hasEpsilon = true;
                for (const auto& sym : rhs) {
                    if (sym->getIsTerminal()) {
                        changed |= first[A].insert(Terminal(sym->getSymbol())).second;
                        hasEpsilon = false;
                        break;
                    } else {
                     NonTerminal B(sym->getSymbol());

                        for (const auto& term : first[B])
                            if (term.getSymbol() != "#")
                                changed |= first[A].insert(term).second;
                        if (!first[B].count(Terminal("#"))) {
                            hasEpsilon = false;
                            break;
                        }
                    }
                }
                if (hasEpsilon)
                    changed |= first[A].insert(Terminal("#")).second;
            }
        }
    } while (changed);
}



/*This function computes the FIRST sets for all non-terminals in the grammar. The FIRST set of a symbol tells us the set of terminals that can appear at the beginning of some string derived from that symbol.

We begin by using a do-while loop with a changed flag to track whether we’re making any updates. The loop continues until no more changes are made to any FIRST set.

Now, inside the loop, we go through every non-terminal A in the grammar and each of its right-hand side productions.

For each production, we check the symbols in the right-hand side from left to right, and we try to figure out what terminals can appear first if this production is used.

We initialize a flag hasEpsilon as true. This flag keeps track of whether the entire production could eventually derive epsilon.

Now, for each symbol in the production:

If the symbol is a terminal, it means the FIRST set of the non-terminal A will definitely include that terminal. So we insert it directly into FIRST(A), mark hasEpsilon as false, and break — because no symbol after a terminal can affect the FIRST set.

But if the symbol is a non-terminal, say B, then we add all the terminals from FIRST(B) — except epsilon — into FIRST(A).
If FIRST(B) does not contain epsilon, that means we cannot skip B, so we set hasEpsilon to false and stop checking further symbols in that production.

If we go through the entire production and hasEpsilon remains true, it means all the symbols in the production can derive epsilon. In that case, we also add epsilon to the FIRST set of A.

We repeat this whole process for all productions until no FIRST set is updated any further.

By the end of the loop, we will have computed the complete and correct FIRST sets for every non-terminal in the grammar.*/