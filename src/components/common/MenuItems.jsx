import React from 'react';
import { useAutoAnimate } from '@formkit/auto-animate/react'
import MyButton from '../UI/MyButton';
const MenuItems = ({
    view,
    activeChat,
    setActiveChat,
    currentUser,
    users = [],
    channels = [],
    openOverlay,
    searchTerm,
}) => {
    const [animationParent] = useAutoAnimate()
    
    return (
        <div className="menu-items" ref={animationParent}>

          {view === 'chats' && (
            <MyButton
                className={"current-user"}
                onClick={() => setActiveChat({...currentUser, type: 'user'})}
                icon={<img src='data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIwLjYiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgY2xhc3M9Imx1Y2lkZSBsdWNpZGUtdXNlci1jb2ciPjxjaXJjbGUgY3g9IjE4IiBjeT0iMTUiIHI9IjMiLz48Y2lyY2xlIGN4PSI5IiBjeT0iNyIgcj0iNCIvPjxwYXRoIGQ9Ik0xMCAxNUg2YTQgNCAwIDAgMC00IDR2MiIvPjxwYXRoIGQ9Im0yMS43IDE2LjQtLjktLjMiLz48cGF0aCBkPSJtMTUuMiAxMy45LS45LS4zIi8+PHBhdGggZD0ibTE2LjYgMTguNy4zLS45Ii8+PHBhdGggZD0ibTE5LjEgMTIuMi4zLS45Ii8+PHBhdGggZD0ibTE5LjYgMTguNy0uNC0xIi8+PHBhdGggZD0ibTE2LjggMTIuMy0uNC0xIi8+PHBhdGggZD0ibTE0LjMgMTYuNiAxLS40Ii8+PHBhdGggZD0ibTIwLjcgMTMuOCAxLS40Ii8+PC9zdmc+' alt={currentUser.name}/>}
                text={<span>{currentUser.name}</span>}
            />
          )}
          
          {view === 'channels' && (
            <MyButton
                className={"current-user"}
                onClick={() => openOverlay('createChannel')}
                icon={<img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIwLjYiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgY2xhc3M9Imx1Y2lkZSBsdWNpZGUtY2lyY2xlLWZhZGluZy1wbHVzIj48cGF0aCBkPSJNMTIgMmExMCAxMCAwIDAgMSA3LjM4IDE2Ljc1Ii8+PHBhdGggZD0iTTEyIDh2OCIvPjxwYXRoIGQ9Ik0xNiAxMkg4Ii8+PHBhdGggZD0iTTIuNSA4Ljg3NWExMCAxMCAwIDAgMC0uNSAzIi8+PHBhdGggZD0iTTIuODMgMTZhMTAgMTAgMCAwIDAgMi40MyAzLjQiLz48cGF0aCBkPSJNNC42MzYgNS4yMzVhMTAgMTAgMCAwIDEgLjg5MS0uODU3Ii8+PHBhdGggZD0iTTguNjQ0IDIxLjQyYTEwIDEwIDAgMCAwIDcuNjMxLS4zOCIvPjwvc3ZnPg==" 
                    alt="+"/>}
                text={<span>{"Create Channel"}</span>}
            />
          )}

          {(searchTerm
            ? (view === "chats" ? users : channels).filter((item) =>
                item.name.toLowerCase().includes(searchTerm.toLowerCase())
              )
            : view === "chats"
            ? users
            : channels
          ).filter(item => item.id !== currentUser.id).map(item => (

            <MyButton
                key={item.id}
                className={activeChat?.id === item.id ? 'active' : ''}
                onClick={() => {
                    setActiveChat(view === 'chats' ? {...item, type: 'user'} : item)
                }}
                icon={<img 
                        src={item.avatar || 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIwLjYiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgY2xhc3M9Imx1Y2lkZSBsdWNpZGUtdXNlcnMiPjxwYXRoIGQ9Ik0xNiAyMXYtMmE0IDQgMCAwIDAtNC00SDZhNCA0IDAgMCAwLTQgNHYyIi8+PGNpcmNsZSBjeD0iOSIgY3k9IjciIHI9IjQiLz48cGF0aCBkPSJNMjIgMjF2LTJhNCA0IDAgMCAwLTMtMy44NyIvPjxwYXRoIGQ9Ik0xNiAzLjEzYTQgNCAwIDAgMSAwIDcuNzUiLz48L3N2Zz4='}
                        alt={item.name} 
                    />}
                text={<span>{item.name}</span>}
            />

          ))}
        </div>
    );
};

export default MenuItems;