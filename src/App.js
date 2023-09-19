import React, { useReducer } from 'react';
import { users } from './mock';

const shaxaReducer = (state, action) => {
  switch (action.type) {
    //get inputs value
    case "GET_INPUT_VALUE": return { ...state, [action.payload.field]: action.payload.value };
    
    //search
    case 'SEARCH':
      let res = users.filter(value => `${value[state.search]}`.toLowerCase().includes(action.payload.toLowerCase()));
      return { ...state, data: res };
    
    //search by category
    case "ON_SELECT": return { ...state, search: action.payload };
    
    //delete
    case "ON_DELETE":
      let filteredData = state.data.filter((value) => value.id !== action.payload.ids);
      return { ...state, data: filteredData };
    
    // create new user
    case "ON_CREATE":
      let newUser = [...state.data, {
        id: state.data.length + 1,
        name: state.name,
        status: state.status
    }];
      return { ...state, data: newUser };
  
    //update
    case "ON_UPDATE": return {
      ...state,
      select: action.payload.allData.id,
      name: action.payload.allData.name,
      status: action.payload.allData.status,
    };
      
    // save updated value
    case "ON_SAVE":
      let updatedValue = state.data.map((value) => value.id === state.select ? { ...value, name: state.name, status: state.status } : value);
      return { ...state, data: updatedValue, select: null };
    
    // default
    default: return state
  }
};


const App = () => {
  
  const [state, dispatch] = useReducer(shaxaReducer, {
     data: users,
     search: "",
     name: "",
     status: "",
     select: null
    });
    
  return (
    <div>
        <select onChange={(e) => dispatch({type:"ON_SELECT", payload: e.target.value})} >
          <option value='id'>id</option>
          <option value='name'>name</option>
          <option value='status'>status</option>
        </select>
        <input onChange={(e) => dispatch({ type: 'SEARCH', payload: e.target.value })} type='text' placeholder='Search...'/>
        <br/>
        <br/>
        <input onChange={(e) => dispatch({type: "GET_INPUT_VALUE", payload:{value: e.target.value, field: e.target.name} })} name='name' type='text' placeholder='name'/>
        <input onChange={(e) => dispatch({ type: "GET_INPUT_VALUE", payload: { value: e.target.value, field: e.target.name } })} name='status' type='text' placeholder='surname' />
        <button onClick={()=> dispatch({type: "ON_CREATE"})} >addUser</button>
        <table border='1px' width='600px' style={{ borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Id</th>
            <th>Name</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {state.data.map((value) => (
            <tr key={value.id}>
              <td>{value.id}</td>
              <td>
                {
                  state.select === value.id ?
                  <input
                  onChange={(e) => dispatch({ type: "GET_INPUT_VALUE", payload: {value: e.target.value, field: e.target.name} })}
                      value={state.name}
                      name='name'
                      type='text'
                  /> :
                  value.name
                }
              </td>
              <td>
              {
                  state.select === value.id ?
                  <input
                  onChange={(e) => dispatch({ type: "GET_INPUT_VALUE", payload: {value: e.target.value, field: e.target.name} })}
                      value={state.status}
                      name='status'
                      type='text'
                  /> :
                  value.status
                }
              </td>
              <td>
                <button onClick={() => dispatch({ type: "ON_DELETE", payload: { ids: value.id } })} >delete</button>
                {
                  state.select === value.id ?
                  <button onClick={()=> dispatch({type: "ON_SAVE"})} >Save</button> :
                  <button onClick={()=> dispatch({type: "ON_UPDATE", payload: {allData: value}})}>edit</button>
                }
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default App