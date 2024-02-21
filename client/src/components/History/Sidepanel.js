// import React, { useState } from 'react';
// import styled from 'styled-components';
// import * as FaIcons from 'react-icons/fa';
// import * as AiIcons from 'react-icons/ai';

// import { Link } from 'react-router-dom';
// import SubMenu from './SubMenu';
// import Sidebar from '../Sidebar/Sidebar';
// import SidebarData from './SidebarData';

// const NavText = styled.div`
//   color: white;
//   font-size: 2rem;
//   margin-right: auto; /* This will push the text to the center */
//   margin-left: auto; /* This will push the text to the center */
//   font-weight:bold;
// `;


// const Nav = styled.div`
//   background: #000000;
//   height: 80px;
//   display: flex;
//   justify-content: flex-end; /* Updated to flex-end */
//   align-items: center;
// `;

// const NavIcon = styled(Link)`
//   margin-right: 2rem; /* Updated to margin-right */
//   font-size: 2rem;
//   height: 80px;
//   display: flex;
//   justify-content: flex-end; /* Updated to flex-end */
//   align-items: center;
  
// `;

// const SidebarNav = styled.nav`
// background: linear-gradient(
//   rgba(0, 0, 0, 1) 0,      /* Solid black color for the first 80 pixels */
//   rgba(0, 0, 0, 1) 80px,   /* Solid black color up to 80 pixels */
//   rgba(0, 0, 0, 0.5) 80px, /* Transition to semi-transparent black color */
//   rgba(0, 0, 0, 0.5)       /* Semi-transparent black color for the remaining height */
// );
//   width: 250px;
//   height: 100vh;
//   display: flex;
//   justify-content: flex-start; /* Updated to flex-start */
//   position: fixed;
//   top: 0;
//   right: ${({ sidebar }) => (sidebar ? '0' : '-100%')}; /* Updated to right */
//   transition: 350ms;
//   z-index: 10;
  
// `;

// const SidebarWrap = styled.div`
//   width: 100%;
// `;

// const Sidepanel = () => {
//   const [sidebar, setSidebar] = useState(false);

//   const showSidebar = () => setSidebar(!sidebar);

//   return (
//     <>
//       <Nav>
//       <NavText>Iotai ID Tracker</NavText>
//         <NavIcon to='#'>
//           <FaIcons.FaBars onClick={showSidebar} style={{ color: 'white' }} />
//         </NavIcon>
//       </Nav>
//       <SidebarNav sidebar={sidebar}>
//         <SidebarWrap>
//           <NavIcon to='#'>
//             <AiIcons.AiOutlineClose onClick={showSidebar} style={{ color: 'white' }} />
//           </NavIcon>
//           <SidebarData/>
//         </SidebarWrap>
//       </SidebarNav>
//     </>
//   );
// };

// export default Sidepanel;



import React, { useState } from 'react';
import styled from 'styled-components';
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';

import { Link } from 'react-router-dom';
import SubMenu from './SubMenu';
import Sidebar from '../Sidebar/Sidebar';
import SidebarData from './SidebarData';

const NavText = styled.div`
  color: white;
  font-size: 2rem;
  margin-right: auto; /* This will push the text to the center */
  margin-left: auto; /* This will push the text to the center */
  font-weight:bold;
`;


const Nav = styled.div`
  background: #000000;
  height: 80px;
  display: flex;
  justify-content: flex-end; /* Updated to flex-end */
  align-items: center;
`;

const NavIcon = styled(Link)`
  margin-right: 2rem; /* Updated to margin-right */
  font-size: 2rem;
  height: 80px;
  display: flex;
  justify-content: flex-end; /* Updated to flex-end */
  align-items: center;
  
`;

const SidebarNav = styled.nav`
background: linear-gradient(
  rgba(0, 0, 0, 1) 0,      /* Solid black color for the first 80 pixels */
  rgba(0, 0, 0, 1) 80px,   /* Solid black color up to 80 pixels */
  rgba(0, 0, 0, 0.5) 80px, /* Transition to semi-transparent black color */
  rgba(0, 0, 0, 0.5)       /* Semi-transparent black color for the remaining height */
);
  width: 250px;
  height: 100vh;
  display: flex;
  justify-content: flex-start; /* Updated to flex-start */
  position: fixed;
  top: 0;
  right: ${({ sidebar }) => (sidebar ? '0' : '-100%')}; /* Updated to right */
  transition: 350ms;
  z-index: 10;
  
`;

const SidebarWrap = styled.div`
  width: 100%;
`;

const Sidepanel = ({  lH, user_id, device_id  }) => {
  const [sidebar, setSidebar] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('24hours');

  const showSidebar = () => setSidebar(!sidebar);


  const handleFilterChange = (filter) => {
    setSelectedFilter(filter);
  };

  

  return (
    <>
      <Nav>
        <NavText>Iotai ID Tracker</NavText>
        <NavIcon to='#'>
          <FaIcons.FaBars onClick={showSidebar} style={{ color: 'white' }} />
        </NavIcon>
      </Nav>
      {/* Pass locationHistory to SidebarData */}
      <SidebarNav sidebar={sidebar}>
        <SidebarWrap>
          <NavIcon to='#'>
            <AiIcons.AiOutlineClose onClick={showSidebar} style={{ color: 'white' }} />
          </NavIcon>
          <SidebarData lH={lH} user_id={user_id} device_id={device_id} onFilterChange={handleFilterChange}/>
        </SidebarWrap>
      </SidebarNav>
    </>
  );
};

export default Sidepanel;
