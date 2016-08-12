To Do
=====

Testing
-------
- React component unit tests
  - Test against different data
- Set up data 
- Inspect data
- Proxy for page items
- Profiling
- No local saving - if that is the bottleneck

Auto metadata
-------------

- Flow type checking on model classes
- Flow annotations for Record
- Model class annotations to no errors
- Work flow for *checking* and stripping types 
- Metadata-only decorators working
- ASTs produced for model classes
- ASTs transformed to metadata
- Workflow for accessing generated metadata at runtime
- Entity view driven from runtime metadata
- Overrides and additions possible to entity view - override metadata, provide own rendering

- Rationalise entity descriptors - use class, editable, display property

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
- Reference property picking and displaying entity description

Report views
------------
- Need to be able to have labels like "Totals" in rows

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

Redux
-----
- Ditch it

Validation
----------
- Entity - basic data - has function to give error map
- Errors should come from metadata
- Errors function is given whole app state when called
  - have to pass app state around everywhere in context?
- Metadata contains rule objects that can validate an object but also describe themselves
  - allow for i18n
- Rule object has validate(value, object, app) and description property
- Rule objects applied in order when validate - stop on first error
- EntityDescriptor has a validate method, delegates to Prop desc
- PropertyDescriptor objects apply their rules and return a list of error messages - usually just one
- Need to do whole object errors too

Improvements
------------
- EntityList has default for displayItem
- Standardize way of passing components into other components
- Flow check on every build

 