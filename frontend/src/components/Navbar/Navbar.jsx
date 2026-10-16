// import React, { useState } from 'react';
// import { GB, SA, DE, ES, IN, AU, US } from 'country-flag-icons/react/3x2';
// import './Navbar.css';

// // --- DATA CONFIGURATIONS ---
// const apartmentsData = [
//   {
//     title: 'Farm Vila',
//     items: [
//       'Wheelwright Cottage House D-55',
//       'Town Place Apartments E-62',
//       'Meadow View D-205',
//       'Luxury Landing E-87',
//       'Heavenly Homes B-64',
//       'Heart and Soul Apartments D-604',
//       'Green Gardens A-72',
//       'Family Villas C-92',
//     ],
//   },
//   {
//     title: 'Luxury Properties',
//     items: [
//       'Town Place Walkups A-404',
//       'Town Place Apartments E-62',
//       'The White House J-54',
//       'Tannery Gardens House B-32',
//       'Noble Park B-106',
//       'MiniPalais D-703',
//       'Heart and Soul Apartments D-604',
//       'Family Villas C-92',
//       'East Side Living',
//     ],
//   },
//   {
//     title: 'Royal House',
//     items: [
//       'Wheelwright Cottage House D-55',
//       'Town Place Walkups A-404',
//       'The White House J-54',
//       'The Never-Ending Story C-52',
//       'Tannery Gardens House B-32',
//       'MiniPalais D-703',
//       'Meadow View D-205',
//       'Heavenly Homes B-64',
//       'Heart and Soul Apartments D-604',
//     ],
//   },
// ];

// const collectionsData = [
//   { name: 'Bestseller', img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400' },
//   { name: 'Farm Vila', img: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400' },
//   { name: 'Properties', img: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400' },
//   { name: 'Royal House', img: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400' },
// ];

// const pagesData = [
//   'About us',
//   'Contact with us',
//   'Faq',
//   'Privacy Policy',
//   'Shipping & Delivery',
//   'Terms & Conditions',
//   'Wishlist',
// ];

// const blogData = ['Blog Page', 'Article Page'];

// const languages = [
//   { label: 'English', flag: <GB className="flag-icon" /> },
//   { label: 'العربية', flag: <SA className="flag-icon" /> },
//   { label: 'Deutsch', flag: <DE className="flag-icon" /> },
//   { label: 'Español', flag: <ES className="flag-icon" /> },
// ];

// const currencies = [
//   { label: 'INR', flag: <IN className="flag-icon" /> },
//   { label: 'AUD $', flag: <AU className="flag-icon" /> },
//   { label: 'USD $', flag: <US className="flag-icon" /> },
// ];

// // --- MAIN NAVBAR COMPONENT ---
// const Navbar = () => {
//   const [activeHoverMenu, setActiveHoverMenu] = useState(null);
//   const [activeClickDropdown, setActiveClickDropdown] = useState(null);

//   const [selectedLang, setSelectedLang] = useState(languages[0]);
//   const [selectedCurr, setSelectedCurr] = useState(currencies[0]);

//   const [isMobileOpen, setIsMobileOpen] = useState(false);
//   const [mobileExpandedSection, setMobileExpandedSection] = useState(null);
//   const [mobileExpandedSub, setMobileExpandedSub] = useState(null);

//   const toggleClickDropdown = (name) => {
//     setActiveClickDropdown(activeClickDropdown === name ? null : name);
//   };

//   const toggleMobileAccordion = (index) => {
//     setMobileExpandedSection(mobileExpandedSection === index ? null : index);
//     setMobileExpandedSub(null);
//   };

//   return (
//     <>
//       <header className="site-header">
//         {/* Left Navigation (Desktop) */}
//         <nav className="header-nav-left">
//           <ul className="nav-menu">
//             {/* Apartments Hover */}
//             <li
//               className="nav-item"
//               onMouseEnter={() => setActiveHoverMenu('apartments')}
//               onMouseLeave={() => setActiveHoverMenu(null)}
//             >
//               <a href="#apartments" className="nav-link">
//                 Apartments <span className="nav-arrow">∨</span>
//               </a>
//               {activeHoverMenu === 'apartments' && (
//                 <div className="mega-dropdown apartments-mega">
//                   <div className="mega-container">
//                     <div className="mega-columns">
//                       {apartmentsData.map((col, idx) => (
//                         <div key={idx} className="mega-col">
//                           <h4 className="mega-title">{col.title}</h4>
//                           <ul className="mega-list">
//                             {col.items.map((item, i) => (
//                               <li key={i}><a href={`#${item}`}>{item}</a></li>
//                             ))}
//                           </ul>
//                         </div>
//                       ))}
//                     </div>
//                     <div className="mega-image-box">
//                       <img
//                         src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=600&q=80"
//                         alt="Property Preview"
//                       />
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </li>

//             {/* Collections Hover */}
//             <li
//               className="nav-item"
//               onMouseEnter={() => setActiveHoverMenu('collections')}
//               onMouseLeave={() => setActiveHoverMenu(null)}
//             >
//               <a href="#collections" className="nav-link">
//                 Collections <span className="nav-arrow">∨</span>
//               </a>
//               {activeHoverMenu === 'collections' && (
//                 <div className="mega-dropdown collections-mega">
//                   <div className="collections-grid">
//                     {collectionsData.map((col, idx) => (
//                       <div key={idx} className="collection-card">
//                         <img src={col.img} alt={col.name} />
//                         <p>{col.name}</p>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </li>

//             {/* Pages Hover */}
//             <li
//               className="nav-item"
//               onMouseEnter={() => setActiveHoverMenu('pages')}
//               onMouseLeave={() => setActiveHoverMenu(null)}
//             >
//               <a href="#pages" className="nav-link">
//                 Pages <span className="nav-arrow">∨</span>
//               </a>
//               {activeHoverMenu === 'pages' && (
//                 <div className="simple-dropdown">
//                   <ul>
//                     {pagesData.map((page, idx) => (
//                       <li key={idx}><a href={`#${page}`}>{page}</a></li>
//                     ))}
//                   </ul>
//                 </div>
//               )}
//             </li>

//             {/* Blog Hover */}
//             <li
//               className="nav-item"
//               onMouseEnter={() => setActiveHoverMenu('blog')}
//               onMouseLeave={() => setActiveHoverMenu(null)}
//             >
//               <a href="#blog" className="nav-link">
//                 Blog <span className="nav-arrow">∨</span>
//               </a>
//               {activeHoverMenu === 'blog' && (
//                 <div className="simple-dropdown">
//                   <ul>
//                     {blogData.map((blog, idx) => (
//                       <li key={idx}><a href={`#${blog}`}>{blog}</a></li>
//                     ))}
//                   </ul>
//                 </div>
//               )}
//             </li>
//           </ul>
//         </nav>

//         {/* Center Logo */}
//         <div className="header-logo">
//           <a href="/">
//             <span className="logo-main">modernreal</span>
//             <span className="logo-sub">estate</span>
//           </a>
//         </div>

//         {/* Right Controls */}
//         <div className="header-nav-right">
//           {/* Language Selector */}
//           <div className="pill-dropdown-wrapper desktop-only">
//             <button className="pill-btn" onClick={() => toggleClickDropdown('lang')} type="button">
//               {selectedLang.flag}
//               <span>{selectedLang.label}</span>
//               <span className="nav-arrow">∨</span>
//             </button>
//             {activeClickDropdown === 'lang' && (
//               <div className="popover-menu">
//                 {languages.map((lang, idx) => (
//                   <div
//                     key={idx}
//                     className="popover-item"
//                     onClick={() => { setSelectedLang(lang); setActiveClickDropdown(null); }}
//                   >
//                     {lang.flag} <span>{lang.label}</span>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* Currency Selector */}
//           <div className="pill-dropdown-wrapper desktop-only">
//             <button className="pill-btn" onClick={() => toggleClickDropdown('curr')} type="button">
//               {selectedCurr.flag}
//               <span>{selectedCurr.label}</span>
//               <span className="nav-arrow">∨</span>
//             </button>
//             {activeClickDropdown === 'curr' && (
//               <div className="popover-menu">
//                 {currencies.map((curr, idx) => (
//                   <div
//                     key={idx}
//                     className="popover-item"
//                     onClick={() => { setSelectedCurr(curr); setActiveClickDropdown(null); }}
//                   >
//                     {curr.flag} <span>{curr.label}</span>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* User Account Button */}
//           <div className="pill-dropdown-wrapper">
//             <button className="circle-btn" onClick={() => toggleClickDropdown('account')} aria-label="Account" type="button">
//               <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
//                 <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
//                 <circle cx="12" cy="7" r="4"></circle>
//               </svg>
//             </button>
//             {activeClickDropdown === 'account' && (
//               <div className="popover-menu account-popover">
//                 <a href="#login" className="popover-item">Log in</a>
//                 <a href="#register" className="popover-item">Create Account</a>
//                 <a href="#wishlist" className="popover-item">Wishlist (0)</a>
//               </div>
//             )}
//           </div>

//           {/* Cart Button (Desktop) */}
//           <button className="pill-btn cart-btn desktop-only" type="button">
//             <span>My Cart: Rs. 0.00</span>
//             <div className="cart-badge-container">
//               <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
//                 <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
//                 <line x1="3" y1="6" x2="21" y2="6"></line>
//                 <path d="M16 10a4 4 0 0 1-8 0"></path>
//               </svg>
//               <span className="cart-badge">0</span>
//             </div>
//           </button>

//           {/* Cart Icon (Mobile View) */}
//           <button className="circle-btn mobile-only" aria-label="Cart" type="button">
//             <div className="cart-badge-container">
//               <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
//                 <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
//                 <line x1="3" y1="6" x2="21" y2="6"></line>
//                 <path d="M16 10a4 4 0 0 1-8 0"></path>
//               </svg>
//               <span className="cart-badge">0</span>
//             </div>
//           </button>

//           {/* Hamburger Button (Mobile View) */}
//           <button className="mobile-hamburger-btn mobile-only" onClick={() => setIsMobileOpen(true)} aria-label="Menu" type="button">
//             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2">
//               <line x1="3" y1="6" x2="21" y2="6"></line>
//               <line x1="3" y1="12" x2="21" y2="12"></line>
//               <line x1="3" y1="18" x2="21" y2="18"></line>
//             </svg>
//           </button>
//         </div>
//       </header>

//       {/* Slide-in Mobile Drawer */}
//       {isMobileOpen && (
//         <div className="mobile-overlay" onClick={() => setIsMobileOpen(false)}>
//           <div className="mobile-drawer" onClick={(e) => e.stopPropagation()}>
//             <div className="mobile-header">
//               <button className="mobile-close-btn" onClick={() => setIsMobileOpen(false)}>✕</button>
//             </div>

//             {/* Mobile Selectors */}
//             <div className="mobile-selectors-row">
//               <div className="mobile-select-box">
//                 {selectedLang.flag}
//                 <select value={selectedLang.label} onChange={(e) => setSelectedLang(languages.find(l => l.label === e.target.value))}>
//                   {languages.map((l, i) => <option key={i} value={l.label}>{l.label}</option>)}
//                 </select>
//                 <span className="select-arrow">∨</span>
//               </div>

//               <div className="mobile-select-box">
//                 {selectedCurr.flag}
//                 <select value={selectedCurr.label} onChange={(e) => setSelectedCurr(currencies.find(c => c.label === e.target.value))}>
//                   {currencies.map((c, i) => <option key={i} value={c.label}>{c.label}</option>)}
//                 </select>
//                 <span className="select-arrow">∨</span>
//               </div>
//             </div>

//             {/* Mobile Accordion */}
//             <div className="mobile-accordion">
//               <div className="accordion-item">
//                 <div className="accordion-header" onClick={() => toggleMobileAccordion(0)}>
//                   <span>Shop All</span>
//                   <span className="accordion-toggle">{mobileExpandedSection === 0 ? '✕' : '∨'}</span>
//                 </div>
//                 {mobileExpandedSection === 0 && (
//                   <div className="accordion-body">
//                     {apartmentsData.map((sub, sIdx) => (
//                       <div key={sIdx} className="nested-item">
//                         <div className="nested-header" onClick={() => setMobileExpandedSub(mobileExpandedSub === sIdx ? null : sIdx)}>
//                           <span>{sub.title}</span>
//                           <span>{mobileExpandedSub === sIdx ? '✕' : '∨'}</span>
//                         </div>
//                         {mobileExpandedSub === sIdx && (
//                           <ul className="sub-links">
//                             {sub.items.map((item, i) => (
//                               <li key={i}><a href={`#${item}`}>{item}</a></li>
//                             ))}
//                           </ul>
//                         )}
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>

//               <div className="accordion-item">
//                 <div className="accordion-header" onClick={() => toggleMobileAccordion(1)}>
//                   <span>Blog</span>
//                   <span className="accordion-toggle">{mobileExpandedSection === 1 ? '✕' : '∨'}</span>
//                 </div>
//                 {mobileExpandedSection === 1 && (
//                   <div className="accordion-body">
//                     <ul className="sub-links">
//                       {blogData.map((item, idx) => (
//                         <li key={idx}><a href={`#${item}`}>{item}</a></li>
//                       ))}
//                     </ul>
//                   </div>
//                 )}
//               </div>

//               <a href="#collections" className="mobile-single-link">All Collection</a>
//               <a href="#about" className="mobile-single-link">About Us</a>
//               <a href="#contact" className="mobile-single-link">Contact Us</a>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default Navbar;


// 2nd used
// import React, { useState, useEffect } from 'react';
// import { GB, SA, DE, ES, IN, AU, US } from 'country-flag-icons/react/3x2';
// import './Navbar.css';
// import { Link } from 'react-router-dom';

// // 1. Mock Data (જ્યાં સુધી Backend API ન હોય ત્યાં સુધી આમાંથી Dynamic રેન્ડર થશે)
// const mockNavData = {
//   menuItems: [
//     { id: 'apartments', title: 'Apartments', type: 'mega' },
//     { id: 'collections', title: 'Collections', type: 'mega' },
//     { id: 'pages', title: 'Pages', type: 'dropdown' },
//     { id: 'blog', title: 'Blog', type: 'dropdown' }
//   ],
//   apartmentsMegaMenu: [
//     {
//       category: 'Farm Vila',
//       items: ['Wheelwright Cottage House D-55', 'Town Place Apartments E-62', 'Meadow View D-205', 'Luxury Landing E-87']
//     },
//     {
//       category: 'Luxury Properties',
//       items: ['Town Place Walkups A-404', 'The White House J-54', 'Tannery Gardens House B-32', 'Noble Park B-106']
//     },
//     {
//       category: 'Royal House',
//       items: ['Wheelwright Cottage House D-55', 'The Never-Ending Story C-52', 'MiniPalais D-703', 'Heavenly Homes B-64']
//     }
//   ],
//   collectionsMegaMenu: [
   
//  { id: 1, name: 'Bestseller', img: '/images/bestseller.jpg' },
//     { id: 2, name: 'Farm Vila', img: '/images/farm-vila.jpg' },
//     { id: 3, name: 'Properties', img: '/images/properties.jpg' },
//     { id: 4, name: 'Royal House', img: '/images/royal-house.jpg' }
// ],
//   pagesDropdown: ['About us', 'Contact with us', 'Faq', 'Privacy Policy', 'Shipping & Delivery', 'Terms & Conditions', 'Wishlist'],
//   blogDropdown: ['Blog Page', 'Article Page']
// };

// const languages = [
//   { code: 'en', label: 'English', flag: <GB className="flag-icon" /> },
//   { code: 'ar', label: 'العربية', flag: <SA className="flag-icon" /> },
//   { code: 'de', label: 'Deutsch', flag: <DE className="flag-icon" /> },
//   { code: 'es', label: 'Español', flag: <ES className="flag-icon" /> }
// ];

// const currencies = [
//   { code: 'INR', label: 'INR', flag: <IN className="flag-icon" /> },
//   { code: 'AUD', label: 'AUD $', flag: <AU className="flag-icon" /> },
//   { code: 'USD', label: 'USD $', flag: <US className="flag-icon" /> }
// ];

// // 2. Component Definition with Dynamic Props
// const Navbar = ({ 
//   apiData = null,          // Backend માંથી આવતો ડેટા
//   cartCount = 0,           // Dynamic Cart Count
//   cartTotal = '0.00',      // Dynamic Cart Price Total
//   onLanguageChange, 
//   onCurrencyChange 
// }) => {
//   // ડેટા ડાયનેમિક સેટ થશે (જો API ડેટા હોય તો એ વાપરશે નહિ તો Mock ડેટા)
//   const navData = apiData || mockNavData;

//   const [activeHoverMenu, setActiveHoverMenu] = useState(null);
//   const [activeClickDropdown, setActiveClickDropdown] = useState(null);

//   const [selectedLang, setSelectedLang] = useState(languages[0]);
//   const [selectedCurr, setSelectedCurr] = useState(currencies[0]);

//   const [isMobileOpen, setIsMobileOpen] = useState(false);
//   const [mobileExpandedSection, setMobileExpandedSection] = useState(null);
//   const [mobileExpandedSub, setMobileExpandedSub] = useState(null);

//   const toggleClickDropdown = (name) => {
//     setActiveClickDropdown(activeClickDropdown === name ? null : name);
//   };

//   const handleLangSelect = (lang) => {
//     setSelectedLang(lang);
//     setActiveClickDropdown(null);
//     if (onLanguageChange) onLanguageChange(lang);
//   };

//   const handleCurrSelect = (curr) => {
//     setSelectedCurr(curr);
//     setActiveClickDropdown(null);
//     if (onCurrencyChange) onCurrencyChange(curr);
//   };

//   return (
//     <>
//       <header className="site-header">
//         {/* Dynamic Desktop Navigation Links */}
//         <nav className="header-nav-left">
//           <ul className="nav-menu">
//             {navData.menuItems.map((menu) => (
//               <li
//                 key={menu.id}
//                 className="nav-item"
//                 onMouseEnter={() => setActiveHoverMenu(menu.id)}
//                 onMouseLeave={() => setActiveHoverMenu(null)}
//               >
//                 <a href={`#${menu.id}`} className="nav-link">
//                   {menu.title} <span className="nav-arrow">∨</span>
//                 </a>

//                 {/* Dynamic Mega Dropdown - Apartments */}
//                 {menu.id === 'apartments' && activeHoverMenu === 'apartments' && (
//                   <div className="mega-dropdown apartments-mega">
//                     <div className="mega-container">
//                       <div className="mega-columns">
//                         {navData.apartmentsMegaMenu.map((col, idx) => (
//                           <div key={idx} className="mega-col">
//                             <h4 className="mega-title">{col.category}</h4>
//                             <ul className="mega-list">
//                               {col.items.map((item, i) => (
//                                 <li key={i}><a href={`#${item}`}>{item}</a></li>
//                               ))}
//                             </ul>
//                           </div>
//                         ))}
//                       </div>
//                       <div className="mega-image-box">
//                       <img 
//   src="/images/property-preview.jpg" 
//   alt="Property Preview" 
// />
//                       </div>
//                     </div>
//                   </div>
//                 )}

//                 {/* Dynamic Mega Dropdown - Collections */}
//                 {menu.id === 'collections' && activeHoverMenu === 'collections' && (
//                   <div className="mega-dropdown collections-mega">
//                     <div className="collections-grid">
//                       {navData.collectionsMegaMenu.map((card) => (
//                         <div key={card.id} className="collection-card">
//                           <img src={card.img} alt={card.name} />
//                           <p>{card.name}</p>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 )}

//                 {/* Dynamic Simple Dropdown - Pages */}
//                 {menu.id === 'pages' && activeHoverMenu === 'pages' && (
//                   <div className="simple-dropdown">
//                     <ul>
//                       {navData.pagesDropdown.map((page, idx) => (
//                         <li key={idx}><a href={`#${page}`}>{page}</a></li>
//                       ))}
//                     </ul>
//                   </div>
//                 )}

//                 {/* Dynamic Simple Dropdown - Blog */}
//                 {menu.id === 'blog' && activeHoverMenu === 'blog' && (
//                   <div className="simple-dropdown">
//                     <ul>
//                       {navData.blogDropdown.map((blog, idx) => (
//                         <li key={idx}><a href={`#${blog}`}>{blog}</a></li>
//                       ))}
//                     </ul>
//                   </div>
//                 )}
//               </li>
//             ))}
//           </ul>
//         </nav>

//         {/* Center Logo */}
//         <div className="header-logo">
//           <a href="/">
//             <span className="logo-main">modernreal</span>
//             <span className="logo-sub">estate</span>
//           </a>
//         </div>

//         {/* Right Controls */}
//         <div className="header-nav-right">
//           {/* Dynamic Language Controls */}
//           <div className="pill-dropdown-wrapper desktop-only">
//             <button className="pill-btn" onClick={() => toggleClickDropdown('lang')} type="button">
//               {selectedLang.flag}
//               <span>{selectedLang.label}</span>
//               <span className="nav-arrow">∨</span>
//             </button>
//             {activeClickDropdown === 'lang' && (
//               <div className="popover-menu">
//                 {languages.map((lang) => (
//                   <div key={lang.code} className="popover-item" onClick={() => handleLangSelect(lang)}>
//                     {lang.flag} <span>{lang.label}</span>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* Dynamic Currency Controls */}
//           <div className="pill-dropdown-wrapper desktop-only">
//             <button className="pill-btn" onClick={() => toggleClickDropdown('curr')} type="button">
//               {selectedCurr.flag}
//               <span>{selectedCurr.label}</span>
//               <span className="nav-arrow">∨</span>
//             </button>
//             {activeClickDropdown === 'curr' && (
//               <div className="popover-menu">
//                 {currencies.map((curr) => (
//                   <div key={curr.code} className="popover-item" onClick={() => handleCurrSelect(curr)}>
//                     {curr.flag} <span>{curr.label}</span>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* User Account Popover */}
//           <div className="pill-dropdown-wrapper">
//             <button className="circle-btn" onClick={() => toggleClickDropdown('account')} aria-label="Account" type="button">
//               <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
//                 <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
//                 <circle cx="12" cy="7" r="4"></circle>
//               </svg>
//             </button>
//             {activeClickDropdown === 'account' && (
//               <div className="popover-menu account-popover">
//                 <a href="/account/login" className="popover-item">Log in</a>
//                 <a href="/account/register" className="popover-item">Create Account</a>
//                 <a href="/wishlist" className="popover-item">Wishlist (0)</a>
//               </div>
//             )}
//           </div>

//           {/* Dynamic Cart Button (Desktop) */}
//           <button className="pill-btn cart-btn desktop-only" type="button">
//             <span>My Cart: Rs. {cartTotal}</span>
//             <div className="cart-badge-container">
//               <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
//                 <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
//                 <line x1="3" y1="6" x2="21" y2="6"></line>
//                 <path d="M16 10a4 4 0 0 1-8 0"></path>
//               </svg>
//               <span className="cart-badge">{cartCount}</span>
//             </div>
//           </button>

//           {/* Dynamic Cart Button (Mobile) */}
//           <button className="circle-btn mobile-only" aria-label="Cart" type="button">
//             <div className="cart-badge-container">
//               <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
//                 <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
//                 <line x1="3" y1="6" x2="21" y2="6"></line>
//                 <path d="M16 10a4 4 0 0 1-8 0"></path>
//               </svg>
//               <span className="cart-badge">{cartCount}</span>
//             </div>
//           </button>

//           {/* Hamburger Menu (Mobile) */}
//           <button className="mobile-hamburger-btn mobile-only" onClick={() => setIsMobileOpen(true)} aria-label="Menu" type="button">
//             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2">
//               <line x1="3" y1="6" x2="21" y2="6"></line>
//               <line x1="3" y1="12" x2="21" y2="12"></line>
//               <line x1="3" y1="18" x2="21" y2="18"></line>
//             </svg>
//           </button>
//         </div>
//       </header>

//       {/* Slide-in Mobile Drawer */}
//       {isMobileOpen && (
//         <div className="mobile-overlay" onClick={() => setIsMobileOpen(false)}>
//           <div className="mobile-drawer" onClick={(e) => e.stopPropagation()}>
//             <div className="mobile-header">
//               <button className="mobile-close-btn" onClick={() => setIsMobileOpen(false)}>✕</button>
//             </div>

//             {/* Mobile Selectors */}
//             <div className="mobile-selectors-row">
//               <div className="mobile-select-box">
//                 {selectedLang.flag}
//                 <select value={selectedLang.code} onChange={(e) => handleLangSelect(languages.find(l => l.code === e.target.value))}>
//                   {languages.map((l) => <option key={l.code} value={l.code}>{l.label}</option>)}
//                 </select>
//                 <span className="select-arrow">∨</span>
//               </div>

//               <div className="mobile-select-box">
//                 {selectedCurr.flag}
//                 <select value={selectedCurr.code} onChange={(e) => handleCurrSelect(currencies.find(c => c.code === e.target.value))}>
//                   {currencies.map((c) => <option key={c.code} value={c.code}>{c.label}</option>)}
//                 </select>
//                 <span className="select-arrow">∨</span>
//               </div>
//             </div>

//             {/* Mobile Dynamic Accordion */}
//             <div className="mobile-accordion">
//               <div className="accordion-item">
//                 <div className="accordion-header" onClick={() => setMobileExpandedSection(mobileExpandedSection === 0 ? null : 0)}>
//                   <span>Shop All</span>
//                   <span className="accordion-toggle">{mobileExpandedSection === 0 ? '✕' : '∨'}</span>
//                 </div>
//                 {mobileExpandedSection === 0 && (
//                   <div className="accordion-body">
//                     {navData.apartmentsMegaMenu.map((sub, sIdx) => (
//                       <div key={sIdx} className="nested-item">
//                         <div className="nested-header" onClick={() => setMobileExpandedSub(mobileExpandedSub === sIdx ? null : sIdx)}>
//                           <span>{sub.category}</span>
//                           <span>{mobileExpandedSub === sIdx ? '✕' : '∨'}</span>
//                         </div>
//                         {mobileExpandedSub === sIdx && (
//                           <ul className="sub-links">
//                             {sub.items.map((item, i) => (
//                               <li key={i}><a href={`#${item}`}>{item}</a></li>
//                             ))}
//                           </ul>
//                         )}
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>

//               <div className="accordion-item">
//                 <div className="accordion-header" onClick={() => setMobileExpandedSection(mobileExpandedSection === 1 ? null : 1)}>
//                   <span>Blog</span>
//                   <span className="accordion-toggle">{mobileExpandedSection === 1 ? '✕' : '∨'}</span>
//                 </div>
//                 {mobileExpandedSection === 1 && (
//                   <div className="accordion-body">
//                     <ul className="sub-links">
//                       {navData.blogDropdown.map((item, idx) => (
//                         <li key={idx}><a href={`#${item}`}>{item}</a></li>
//                       ))}
//                     </ul>
//                   </div>
//                 )}
//               </div>

//               <a href="#collections" className="mobile-single-link">All Collection</a>
//               {/* <a href="/about-us" className="mobile-single-link">About Us</a> */}
//                 {/* <Link to="/about-us" className="mobile-single-link">
//       About Us
//     </Link> */}

//  <a
//   href="/About"
//   className="mobile-single-link"
//   onClick={() => setIsMobileOpen(false)}
// >
//   About Us
// </a>


  
//               <a href="/contact" className="mobile-single-link">Contact Us</a>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default Navbar;




// claude


import React, { useState } from 'react';
import { GB, SA, DE, ES, IN, AU, US } from 'country-flag-icons/react/3x2';
import { Link } from 'react-router-dom';
import './Navbar.css';
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { useWishlist } from "../../context/WishlistContext";
// ==========================================
// MOCK DATA (used until a real backend API is connected)
// Every navigable item now carries a real "path" instead of a bare label.
// ==========================================
const mockNavData = {
  menuItems: [
    { id: 'apartments', title: 'Apartments', type: 'mega' },
    { id: 'collections', title: 'Collections', type: 'mega' },
    { id: 'pages', title: 'Pages', type: 'dropdown' },
    { id: 'blog', title: 'Blog', type: 'dropdown' },
  ],

  apartmentsMegaMenu: [
    {
      category: 'Farm Vila',
      items: [
        { label: 'Wheelwright Cottage House D-55', path: '/property/wheelwright-cottage-house-d-55' },
        { label: 'Town Place Apartments E-62', path: '/property/town-place-apartments-e-62' },
        { label: 'Meadow View D-205', path: '/property/meadow-view-d-205' },
        { label: 'Luxury Landing E-87', path: '/property/luxury-landing-e-87' },
      ],
    },
    {
      category: 'Luxury Properties',
      items: [
        { label: 'Town Place Walkups A-404', path: '/property/town-place-walkups-a-404' },
        { label: 'The White House J-54', path: '/property/the-white-house-j-54' },
        { label: 'Tannery Gardens House B-32', path: '/property/tannery-gardens-house-b-32' },
        { label: 'Noble Park B-106', path: '/property/noble-park-b-106' },
      ],
    },
    {
      category: 'Royal House',
      items: [
        { label: 'Wheelwright Cottage House D-55', path: '/property/wheelwright-cottage-house-d-55' },
        { label: 'The Never-Ending Story C-52', path: '/property/the-never-ending-story-c-52' },
        { label: 'MiniPalais D-703', path: '/property/minipalais-d-703' },
        { label: 'Heavenly Homes B-64', path: '/property/heavenly-homes-b-64' },
      ],
    },
  ],

  collectionsMegaMenu: [
    { id: 1, name: 'Bestseller', img: '/images/bestseller.jpg', path: '/collections/bestseller' },
    { id: 2, name: 'Farm Vila', img: '/images/farm-vila.jpg', path: '/collections/farm-vila' },
    { id: 3, name: 'Properties', img: '/images/properties.jpg', path: '/collections/properties' },
    { id: 4, name: 'Royal House', img: '/images/royal-house.jpg', path: '/collections/royal-house' },
  ],

  pagesDropdown: [
    { label: 'About us', path: '/About' },
    { label: 'Contact with us', path: '/contact' },
    { label: 'Faq', path: '/faq' },
    { label: 'Privacy Policy', path: '/privacy-policy' },
    { label: 'Shipping & Delivery', path: '/shipping-delivery' },
    { label: 'Terms & Conditions', path: '/terms-conditions' },
    { label: 'Wishlist', path: '/wishlist' },
  ],

  blogDropdown: [
    { label: 'Blog Page', path: '/blog' },
    { label: 'Article Page', path: '/homes-speaking/4' },
  ],
};

const languages = [
  { code: 'en', label: 'English', flag: <GB className="flag-icon" /> },
  { code: 'ar', label: 'العربية', flag: <SA className="flag-icon" /> },
  { code: 'de', label: 'Deutsch', flag: <DE className="flag-icon" /> },
  { code: 'es', label: 'Español', flag: <ES className="flag-icon" /> },
];

const currencies = [
  { code: 'INR', label: 'INR', flag: <IN className="flag-icon" /> },
  { code: 'AUD', label: 'AUD $', flag: <AU className="flag-icon" /> },
  { code: 'USD', label: 'USD $', flag: <US className="flag-icon" /> },
];

// ==========================================
// COMPONENT
// ==========================================
const Navbar = ({
  apiData = null,       // Backend-provided nav data (falls back to mock)
  // cartCount = 0,
  // cartTotal = '0.00',
  onLanguageChange,
  onCurrencyChange,
}) => {
  const navData = apiData || mockNavData;
  const [activeHoverMenu, setActiveHoverMenu] = useState(null);
  const [activeClickDropdown, setActiveClickDropdown] = useState(null);
const { cartCount, cartTotal } = useCart();
const { user, isAuthenticated, logout } = useAuth();
const { wishlist } = useWishlist();

const [isCartOpen, setIsCartOpen] = useState(false);

  const [selectedLang, setSelectedLang] = useState(languages[0]);
  const [selectedCurr, setSelectedCurr] = useState(currencies[0]);

  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [mobileExpandedSection, setMobileExpandedSection] = useState(null);
  const [mobileExpandedSub, setMobileExpandedSub] = useState(null);

  const toggleClickDropdown = (name) => {
    setActiveClickDropdown(activeClickDropdown === name ? null : name);
  };

  const handleLangSelect = (lang) => {
    setSelectedLang(lang);
    setActiveClickDropdown(null);
    if (onLanguageChange) onLanguageChange(lang);
  };

  const handleCurrSelect = (curr) => {
    setSelectedCurr(curr);
    setActiveClickDropdown(null);
    if (onCurrencyChange) onCurrencyChange(curr);
  };

  const closeMobileMenu = () => {
    setIsMobileOpen(false);
    setMobileExpandedSection(null);
    setMobileExpandedSub(null);
  };

  return (
    <>
      <header className="site-header">
        {/* ====================================
            DESKTOP NAVIGATION
        ==================================== */}
        <nav className="header-nav-left">
          <ul className="nav-menu">
            {navData.menuItems.map((menu) => (
              <li
                key={menu.id}
                className="nav-item"
                onMouseEnter={() => setActiveHoverMenu(menu.id)}
                onMouseLeave={() => setActiveHoverMenu(null)}
              >
                {/*
                  Top-level triggers (Apartments / Collections / Pages / Blog)
                  only open a hover dropdown — they don't navigate anywhere
                  themselves, so they're plain buttons rather than links.
                */}
                <button type="button" className="nav-link nav-link-trigger">
                  {menu.title} <span className="nav-arrow">∨</span>
                </button>

                {/* Mega Dropdown - Apartments */}
                {menu.id === 'apartments' && activeHoverMenu === 'apartments' && (
                  <div className="mega-dropdown apartments-mega">
                    <div className="mega-container">
                      <div className="mega-columns">
                        {navData.apartmentsMegaMenu.map((col, idx) => (
                          <div key={idx} className="mega-col">
                            <h4 className="mega-title">{col.category}</h4>
                            <ul className="mega-list">
                              {col.items.map((item, i) => (
                                <li key={i}>
                                  <Link
                                    to={item.path}
                                    onClick={() => setActiveHoverMenu(null)}
                                  >
                                    {item.label}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                      <div className="mega-image-box">
                        <img src="/images/property-preview.jpg" alt="Property Preview" />
                      </div>
                    </div>
                  </div>
                )}

                {/* Mega Dropdown - Collections */}
                {menu.id === 'collections' && activeHoverMenu === 'collections' && (
                  <div className="mega-dropdown collections-mega">
                    <div className="collections-grid">
                      {navData.collectionsMegaMenu.map((card) => (
                        <Link
                          to={card.path}
                          key={card.id}
                          className="collection-card"
                          onClick={() => setActiveHoverMenu(null)}
                        >
                          <img src={card.img} alt={card.name} />
                          <p>{card.name}</p>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Simple Dropdown - Pages */}
                {menu.id === 'pages' && activeHoverMenu === 'pages' && (
                  <div className="simple-dropdown">
                    <ul>
                      {navData.pagesDropdown.map((page, idx) => (
                        <li key={idx}>
                          <Link to={page.path} onClick={() => setActiveHoverMenu(null)}>
                            {page.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Simple Dropdown - Blog */}
                {menu.id === 'blog' && activeHoverMenu === 'blog' && (
                  <div className="simple-dropdown">
                    <ul>
                      {navData.blogDropdown.map((blog, idx) => (
                        <li key={idx}>
                          <Link to={blog.path} onClick={() => setActiveHoverMenu(null)}>
                            {blog.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* ====================================
            CENTER LOGO
        ==================================== */}
        <div className="header-logo">
          <Link to="/">
            <span className="logo-main">modernreal</span>
            <span className="logo-sub">estate</span>
          </Link>
        </div>

        {/* ====================================
            RIGHT CONTROLS
        ==================================== */}
        <div className="header-nav-right">
          {/* Language Selector */}
          <div className="pill-dropdown-wrapper desktop-only">
            <button className="pill-btn" onClick={() => toggleClickDropdown('lang')} type="button">
              {selectedLang.flag}
              <span>{selectedLang.label}</span>
              <span className="nav-arrow">∨</span>
            </button>
            {activeClickDropdown === 'lang' && (
              <div className="popover-menu">
                {languages.map((lang) => (
                  <div key={lang.code} className="popover-item" onClick={() => handleLangSelect(lang)}>
                    {lang.flag} <span>{lang.label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Currency Selector */}
          <div className="pill-dropdown-wrapper desktop-only">
            <button className="pill-btn" onClick={() => toggleClickDropdown('curr')} type="button">
              {selectedCurr.flag}
              <span>{selectedCurr.label}</span>
              <span className="nav-arrow">∨</span>
            </button>
            {activeClickDropdown === 'curr' && (
              <div className="popover-menu">
                {currencies.map((curr) => (
                  <div key={curr.code} className="popover-item" onClick={() => handleCurrSelect(curr)}>
                    {curr.flag} <span>{curr.label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Account Popover */}
          <div className="pill-dropdown-wrapper">
            <button
              className="circle-btn"
              onClick={() => toggleClickDropdown('account')}
              aria-label="Account"
              type="button"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </button>
            {/* {activeClickDropdown === 'account' && (
              <div className="popover-menu account-popover">
                <Link
                  to="/account/login"
                  className="popover-item"
                  onClick={() => setActiveClickDropdown(null)}
                >
                  Log in
                </Link>
                <Link
                  to="/account/register"
                  className="popover-item"
                  onClick={() => setActiveClickDropdown(null)}
                >
                  Create Account
                </Link>
                <Link
                  to="/wishlist"
                  className="popover-item"
                  onClick={() => setActiveClickDropdown(null)}
                >
                  Wishlist (0)
                </Link>
              </div>
            )} */}


            {activeClickDropdown === "account" && (
  <div className="popover-menu account-popover">

    {isAuthenticated && user ? (
      <>
        <div className="popover-item">
          {user.name ||
            `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
            user.email}
        </div>
{/* 
        <Link
          to="/wishlist"
          className="popover-item"
          onClick={() => setActiveClickDropdown(null)}
        >
          Wishlist (0)
        </Link> */}

        <Link
  to="/wishlist"
  className="popover-item"
  onClick={() => setActiveClickDropdown(null)}
>
  Wishlist ({wishlist.length})
</Link>

        {user.role === "admin" && (
          <Link
            to="/admin"
            className="popover-item"
            onClick={() => setActiveClickDropdown(null)}
          >
            Admin Dashboard
          </Link>
        )}

        <button
          type="button"
          className="popover-item logout-btn"
          onClick={() => {
            logout();
            setActiveClickDropdown(null);
          }}
        >
          Logout
        </button>
      </>
    ) : (
      <>
        <Link
          to="/account/login"
          className="popover-item"
          onClick={() => setActiveClickDropdown(null)}
        >
          Log in
        </Link>

        <Link
          to="/account/register"
          className="popover-item"
          onClick={() => setActiveClickDropdown(null)}
        >
          Create Account
        </Link>

        <Link
          to="/wishlist"
          className="popover-item"
          onClick={() => setActiveClickDropdown(null)}
        >
          Wishlist (0)
        </Link>
      </>
    )}

  </div>
)}
          </div>

          {/* Cart Button (Desktop) */}
          <Link to="/cart" className="pill-btn cart-btn desktop-only">
            <span>My Cart: Rs. {cartTotal}</span>
            <div className="cart-badge-container">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <path d="M16 10a4 4 0 0 1-8 0"></path>
              </svg>
              <span className="cart-badge">{cartCount}</span>
            </div>
          </Link>

          {/* Cart Button (Mobile) */}
          <Link to="/cart" className="circle-btn mobile-only" aria-label="Cart">
            <div className="cart-badge-container">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <path d="M16 10a4 4 0 0 1-8 0"></path>
              </svg>
              <span className="cart-badge">{cartCount}</span>
            </div>
          </Link>

          {/* Hamburger (Mobile) */}
          <button
            className="mobile-hamburger-btn mobile-only"
            onClick={() => setIsMobileOpen(true)}
            aria-label="Menu"
            type="button"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2">
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
        </div>
      </header>

      {/* ====================================
          MOBILE DRAWER
      ==================================== */}
      {isMobileOpen && (
        <div className="mobile-overlay" onClick={closeMobileMenu}>
          <div className="mobile-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="mobile-header">
              <button className="mobile-close-btn" onClick={closeMobileMenu}>
                ✕
              </button>
            </div>

            {/* Mobile Selectors */}
            <div className="mobile-selectors-row">
              <div className="mobile-select-box">
                {selectedLang.flag}
                <select
                  value={selectedLang.code}
                  onChange={(e) => handleLangSelect(languages.find((l) => l.code === e.target.value))}
                >
                  {languages.map((l) => (
                    <option key={l.code} value={l.code}>
                      {l.label}
                    </option>
                  ))}
                </select>
                <span className="select-arrow">∨</span>
              </div>

              <div className="mobile-select-box">
                {selectedCurr.flag}
                <select
                  value={selectedCurr.code}
                  onChange={(e) => handleCurrSelect(currencies.find((c) => c.code === e.target.value))}
                >
                  {currencies.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.label}
                    </option>
                  ))}
                </select>
                <span className="select-arrow">∨</span>
              </div>
            </div>

            {/* Mobile Accordion */}
            <div className="mobile-accordion">
              {/* Shop All (Apartments) */}
              <div className="accordion-item">
                <div
                  className="accordion-header"
                  onClick={() =>
                    setMobileExpandedSection(mobileExpandedSection === 0 ? null : 0)
                  }
                >
                  <span>Shop All</span>
                  <span className="accordion-toggle">
                    {mobileExpandedSection === 0 ? '✕' : '∨'}
                  </span>
                </div>
                {mobileExpandedSection === 0 && (
                  <div className="accordion-body">
                    {navData.apartmentsMegaMenu.map((sub, sIdx) => (
                      <div key={sIdx} className="nested-item">
                        <div
                          className="nested-header"
                          onClick={() =>
                            setMobileExpandedSub(mobileExpandedSub === sIdx ? null : sIdx)
                          }
                        >
                          <span>{sub.category}</span>
                          <span>{mobileExpandedSub === sIdx ? '✕' : '∨'}</span>
                        </div>
                        {mobileExpandedSub === sIdx && (
                          <ul className="sub-links">
                            {sub.items.map((item, i) => (
                              <li key={i}>
                                <Link to={item.path} onClick={closeMobileMenu}>
                                  {item.label}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Pages */}
              <div className="accordion-item">
                <div
                  className="accordion-header"
                  onClick={() =>
                    setMobileExpandedSection(mobileExpandedSection === 1 ? null : 1)
                  }
                >
                  <span>Pages</span>
                  <span className="accordion-toggle">
                    {mobileExpandedSection === 1 ? '✕' : '∨'}
                  </span>
                </div>
                {mobileExpandedSection === 1 && (
                  <div className="accordion-body">
                    <ul className="sub-links">
                      {navData.pagesDropdown.map((item, idx) => (
                        <li key={idx}>
                          <Link to={item.path} onClick={closeMobileMenu}>
                            {item.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Blog */}
              <div className="accordion-item">
                <div
                  className="accordion-header"
                  onClick={() =>
                    setMobileExpandedSection(mobileExpandedSection === 2 ? null : 2)
                  }
                >
                  <span>Blog</span>
                  <span className="accordion-toggle">
                    {mobileExpandedSection === 2 ? '✕' : '∨'}
                  </span>
                </div>
                {mobileExpandedSection === 2 && (
                  <div className="accordion-body">
                    <ul className="sub-links">
                      {navData.blogDropdown.map((item, idx) => (
                        <li key={idx}>
                          <Link to={item.path} onClick={closeMobileMenu}>
                            {item.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Collections */}
              <div className="accordion-item">
                <div
                  className="accordion-header"
                  onClick={() =>
                    setMobileExpandedSection(mobileExpandedSection === 3 ? null : 3)
                  }
                >
                  <span>Collections</span>
                  <span className="accordion-toggle">
                    {mobileExpandedSection === 3 ? '✕' : '∨'}
                  </span>
                </div>
                {mobileExpandedSection === 3 && (
                  <div className="accordion-body">
                    <ul className="sub-links">
                      {navData.collectionsMegaMenu.map((card) => (
                        <li key={card.id}>
                          <Link to={card.path} onClick={closeMobileMenu}>
                            {card.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <Link to="/About" className="mobile-single-link" onClick={closeMobileMenu}>
                About Us
              </Link>

              <Link to="/contact" className="mobile-single-link" onClick={closeMobileMenu}>
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;



