To Do
=====

Auto metadata
-------------

- Flow type checking on model classes
- Flow annotations for Record
- Model class annotations to no errors
- Work flow for checking and stripping types 
- Metadata-only decorators working
- ASTs produced for model classes
- ASTs transformed to metadata
- Workflow for accessing generated metadata at runtime
- Entity view driven from runtime metadata
- Overrides and additions possible to entity view - override metadata, provide own rendering

List view
---------
- General list view
- Parameterized with item display view and item edit view - as functions? as classes?
- Try function from item => element for display, or (item, onSave) => element for edit
- Click to edit handled by list or its sub-item
- Is given an immutable List of entity items

Entity view
-----------
- Reduce callbacks to on save - up to container to know whether new object or not
- Properties displayed - can have default on metadata
- Horizontal layout variant

Storing changes
---------------
- Need to store only updated writable fields
- Need to store only fields that have changed
- May need to use json patch - but could be overkill, may not work for lists anyway

Routing
-------
- Need to re-render elements to get overall changes without destroying pages with in-progress changes
- Persistent router caches component so new one created with new state is not used
- Maybe suppress update if not visible
 