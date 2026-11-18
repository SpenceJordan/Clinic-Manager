import React, { useState } from "react";
import { Plus } from "lucide-react";
import { fmt, today } from "../lib/utils";
import { Alert, Badge, C, Card, FF, FR, IS, Icon, PB, PageHeader, SS, Segmented, XB } from "../ui";

// ─── InventoryPage ─────────────────────────────────────────────────────────────
export function InventoryPage({inventory,setInventory}){
  const[catFilter,setCatFilter]=useState("All");
  const[showAdd,setShowAdd]=useState(false);
  const[newItem,setNewItem]=useState({name:"",category:"Supplies",qty:0,unit:"units",reorderAt:10,reorderQty:50,supplier:""});
  const[qtyEdit,setQtyEdit]=useState({});
  const cats=["All",...[...new Set(inventory.map(i=>i.category))]];
  const filtered=catFilter==="All"?inventory:inventory.filter(i=>i.category===catFilter);
  const lowStock=inventory.filter(i=>i.qty<=i.reorderAt);
  const outOfStock=inventory.filter(i=>i.qty===0);
  const updateQty=(id,val)=>{
    const n=Math.max(0,parseInt(val)||0);
    setInventory(prev=>prev.map(i=>i.id===id?{...i,qty:n}:i));
  };
  const markOrdered=(id)=>{
    setInventory(prev=>prev.map(i=>i.id===id?{...i,lastOrdered:today(),qty:i.qty+i.reorderQty}:i));
  };
  const addItem=()=>{
    if(!newItem.name)return;
    setInventory(prev=>[...prev,{...newItem,id:Date.now(),qty:parseInt(newItem.qty)||0,reorderAt:parseInt(newItem.reorderAt)||10,reorderQty:parseInt(newItem.reorderQty)||50,lastOrdered:""}]);
    setNewItem({name:"",category:"Supplies",qty:0,unit:"units",reorderAt:10,reorderQty:50,supplier:""});
    setShowAdd(false);
  };
  return(
    <div style={{padding:"24px 32px 48px",maxWidth:1440}}>
      <PageHeader title="Inventory" meta={`${inventory.length} items · ${[...new Set(inventory.map(i=>i.supplier))].length} suppliers`}
        status={lowStock.length>0?<Badge color="red">{lowStock.length} low stock</Badge>:<Badge color="green">All stocked</Badge>}
        actions={<PB onClick={()=>setShowAdd(v=>!v)}><Icon as={Plus}/>Add item</PB>}/>
      {lowStock.length>0&&<Alert tone="red" title={`${lowStock.length} item${lowStock.length>1?"s":""} at or below reorder level`} meta={lowStock.map(i=>i.name).join(", ")} style={{marginBottom:12}}
        actions={<button className="text-link" onClick={()=>lowStock.forEach(i=>markOrdered(i.id))}>Mark all as ordered</button>}/>}
      <div style={{marginBottom:12}}><Segmented size="sm" value={catFilter} onChange={setCatFilter} options={cats.map(c=>[c,c,null,c==="All"?0:inventory.filter(i=>i.category===c).length])}/></div>
      {showAdd&&(
        <Card style={{marginBottom:16,padding:"16px 20px"}}>
          <div style={{fontWeight:600,fontSize:15,color:C.text,marginBottom:16}}>New item</div>
          <FR><FF label="Name"><input value={newItem.name} onChange={e=>setNewItem(f=>({...f,name:e.target.value}))} style={IS}/></FF><FF label="Category"><select value={newItem.category} onChange={e=>setNewItem(f=>({...f,category:e.target.value}))} style={SS}>{["PPE","Supplies","Equipment","Medication"].map(c=><option key={c}>{c}</option>)}</select></FF></FR>
          <FR><FF label="Quantity"><input type="number" value={newItem.qty} onChange={e=>setNewItem(f=>({...f,qty:e.target.value}))} style={IS}/></FF><FF label="Unit"><input value={newItem.unit} onChange={e=>setNewItem(f=>({...f,unit:e.target.value}))} style={IS} placeholder="units"/></FF></FR>
          <FR><FF label="Reorder at"><input type="number" value={newItem.reorderAt} onChange={e=>setNewItem(f=>({...f,reorderAt:e.target.value}))} style={IS}/></FF><FF label="Reorder quantity"><input type="number" value={newItem.reorderQty} onChange={e=>setNewItem(f=>({...f,reorderQty:e.target.value}))} style={IS}/></FF></FR>
          <FR cols={1}><FF label="Supplier"><input value={newItem.supplier} onChange={e=>setNewItem(f=>({...f,supplier:e.target.value}))} style={IS}/></FF></FR>
          <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}><XB onClick={()=>setShowAdd(false)}>Cancel</XB><PB onClick={addItem} disabled={!newItem.name}>Add item</PB></div>
        </Card>
      )}
      <Card style={{overflow:"hidden"}}>
        <table className="tbl" style={{width:"100%",borderCollapse:"collapse"}}>
          <thead><tr>{["Item","Category","Quantity","Reorder at","Supplier","Last ordered","Status",""].map((h,hi)=><th key={hi} style={{padding:"12px 16px 8px",textAlign:"left",fontSize:12,fontWeight:400,color:C.muted,borderBottom:`1px solid ${C.border}`}}>{h}</th>)}</tr></thead>
          <tbody>
            {filtered.map((item,i)=>{
              const isLow=item.qty<=item.reorderAt;
              const isEditing=qtyEdit[item.id]!==undefined;
              return(
                <tr key={item.id} style={{borderBottom:i<filtered.length-1?`1px solid ${C.border}`:"none"}}>
                  <td style={{padding:"12px 16px",fontWeight:500,fontSize:14,color:C.text}}>{item.name}</td>
                  <td style={{padding:"12px 16px",fontSize:13,color:C.text2}}>{item.category}</td>
                  <td style={{padding:"12px 16px"}}>
                    <div style={{display:"flex",alignItems:"center",gap:6}}>
                      <button onClick={()=>updateQty(item.id,item.qty-1)} aria-label={`Decrease ${item.name}`} className="icon-btn" style={{width:28,height:28,borderRadius:6,border:`1px solid ${C.border2}`,cursor:"pointer",color:C.text2,fontSize:16,lineHeight:1,display:"flex",alignItems:"center",justifyContent:"center"}}>−</button>
                      <input
                        type="number"
                        value={isEditing?qtyEdit[item.id]:item.qty}
                        onChange={e=>setQtyEdit(prev=>({...prev,[item.id]:e.target.value}))}
                        onBlur={e=>{if(isEditing){updateQty(item.id,qtyEdit[item.id]);setQtyEdit(prev=>{const n={...prev};delete n[item.id];return n;});}}}
                        aria-label={`${item.name} quantity`} style={{...IS,width:64,textAlign:"center",padding:"4px 6px",fontFamily:C.mono,fontVariantNumeric:"tabular-nums"}}
                      />
                      <button onClick={()=>updateQty(item.id,item.qty+1)} aria-label={`Increase ${item.name}`} className="icon-btn" style={{width:28,height:28,borderRadius:6,border:`1px solid ${C.border2}`,cursor:"pointer",color:C.text2,fontSize:16,lineHeight:1,display:"flex",alignItems:"center",justifyContent:"center"}}>+</button>
                    </div>
                  </td>
                  <td style={{padding:"12px 16px",fontSize:13,color:C.text2}}><span style={{fontFamily:C.mono,fontVariantNumeric:"tabular-nums"}}>{item.reorderAt}</span> {item.unit}</td>
                  <td style={{padding:"12px 16px",fontSize:13,color:C.text2}}>{item.supplier||"—"}</td>
                  <td style={{padding:"12px 16px",fontSize:13,color:C.text2}}>{item.lastOrdered?fmt(item.lastOrdered):"—"}</td>
                  <td style={{padding:"12px 16px"}}>{item.qty===0?<Badge color="red">Out of stock</Badge>:isLow?<Badge color="red">Reorder</Badge>:item.qty<=item.reorderAt*1.5?<Badge color="amber">Running low</Badge>:<Badge color="green">In stock</Badge>}</td>
                  <td style={{padding:"12px 16px"}}>
                    <button onClick={()=>markOrdered(item.id)} className="btn btn-secondary btn-sm" >Mark ordered</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
