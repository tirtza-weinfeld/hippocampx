 Current Button Functions                                                                                   
                                                                                                             
  | Button       | Action                                                                           |        
  Keyboard |                                                                                                 
  |--------------|----------------------------------------------------------------------------------|--------
  --|                                                                                                        
  | Zoom In      | Scales canvas by 1.2x (max 200%)                                                 | +      
    |                                                                                                        
  | Zoom Out     | Scales canvas by 1/1.2x (min 25%)                                                | -      
    |                                                                                                        
  | Fit View     | Calculates bounds of all tables, centers and scales to fit viewport with margins | F      
    |                                                                                                        
  | Reset Layout | Recomputes the entire layout algorithm, then fits to view                        | R      
    |                                                                                                        
                                                                                                             
  The zoom display shows current scale as percentage.                                                        
                                                                                                             
  What's Missing for "Bleeding Edge 2026"                                                                    
                                                                                                             
  Navigation:                                                                                                
  - No minimap for large diagrams                                                                            
  - No center-on-table / zoom-to-selection                                                                   
  - No search/jump-to functionality                                                                          
  - No zoom-to-cursor (zooms from origin, not mouse position)                                                
                                                                                                             
  Collaboration & Export:                                                                                    
  - No screenshot/export (PNG, SVG)                                                                          
  - No shareable view state (URL with pan/zoom/selection)                                                    
  - No copy-as-code (DDL, types)                                                                             
                                                                                                             
  Layout Intelligence:                                                                                       
  - No layout algorithm toggle (force-directed, hierarchical, radial)                                        
  - No auto-arrange selected tables                                                                          
  - No grid snapping                                                                                         
  - No undo/redo for position changes                                                                        
                                                                                                             
  Discoverability:                                                                                           
  - No keyboard shortcuts panel / help overlay                                                               
  - Tooltips don't mention Ctrl+wheel for table-specific zoom                                                
                                                                                                             
  Visual Issues with Current Controls:                                                                       
  1. Icons are stroke-only, feel thin and dated                                                              
  2. No visual hierarchy between zoom group vs action buttons                                                
  3. No active/pressed states beyond basic scale                                                             
  4. Zoom % display is passive (could be interactive slider)                                                 
  5. No entrance animation                                                                                   
  6. Panel feels generic, not integrated with the ER aesthetic                                               
                                                                                                             
  Would you like me to redesign the controls with modern features and styling? I can:                        
                                                                                                             
  1. Quick fix - Just improve the visual styling (icons, animations, polish)                                 
  2. Medium scope - Add minimap, zoom slider, export, and better visuals                                     
  3. Full redesign - Comprehensive controls with search, layout algorithms, keyboard panel, shareable state  
                                                                                                             