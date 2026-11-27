

`aliases`: depict other potential names of an ingredient. The ingredient name is not guaranteed, as of now, to be an INCI name of itself. 

`research_status`: informs whether an ingredient needs further clarification of it's effects or if there are any doubts. Important to note is: this is a very lose term.
Current possible values of `research_status` field:
- `partially_reviewed`,
- `reviewed`


`verified`: means that the source study or studies that derived a concern or potentiall harmfull efect, were conducted with significant enough sample size and that posess no apparent lapses in judgement and scientific methods. If there are any doubts ingredient is marked with "partially reviewed". 
This mark is also used to determine if an ingredient's effect has been verified in extensive research.


`works`: means that the ingredient has at least one working `helps_with` effect. If an effect isn't verified it's not added to the `helps_with` clauses (excluding partially verified ones).

`desc` : A short description that depicts additional information about the ingredient, or it's placement in json(e.g. description why the field `works` is null).

`evidence`: is a short summary lifted *verbatim* from the published study
`source`: might include more sources separated via `;`.

`category`: some ingredient's posses a category field. This helps them group into their respective groups (such as in the case of mandelic acid and glycolic acid which where grouped to the 'AHA' family).


Each `helps_with` clause contains a list of concerns that the ingredient was proven to solve.
It consists of these fields:
>{concern: string, 
> evidence: string,
> source: string,
> status: string
> }

Some of these fields where explained above

`may_cause` JSON field depicts what are the possible side effects of an ingredient. It is a list of these types of 'objects'(this term is lose again because in JSON notations there are no objects I use this as a sort of alias of properties inside: {} parenthesis, as well as a logic division of this JSON):
>{effect: string, source: string, evidence: string, status: string}

