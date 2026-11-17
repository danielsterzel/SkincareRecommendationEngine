### Data infrastructure


#### SkinTarget node

SkinTarget node is made up off these fields in Neo4j database:
- `key` representing the meaning of SkinTarget node such as: "uv_protection", "blemishes" or "visible_shine"
- `aliases`
- `category` - possible values: `OTHER`, `PRODUCT_FUNCTION`, `SKIN_CONCERN`, `SKIN_GOAL`

Unique values of SkinTarget node keys  are found in this JSON
> skin_targets.json

These values can be accessed via these JSON attributes: 
- product functions
- skin_goals
- skin_concern
