import React from 'react';

const MemberItem = ({
    member, 
    overlayData, 
    currentUser, 
    removeUserFromChannel
}) => {
    return (
        <div className="member-item">
        <img 
          src={member.avatar || 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIwLjYiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgY2xhc3M9Imx1Y2lkZSBsdWNpZGUtY2lyY2xlLXVzZXItcm91bmQiPjxwYXRoIGQ9Ik0xOCAyMGE2IDYgMCAwIDAtMTIgMCIvPjxjaXJjbGUgY3g9IjEyIiBjeT0iMTAiIHI9IjQiLz48Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxMCIvPjwvc3ZnPg=='}
          alt={member.name}
        />
        <span>{member.name} {member.isAdmin && '(Admin)'}</span>
        {overlayData.adminId === currentUser.id && !member.isAdmin && (
          <button 
            onClick={() => removeUserFromChannel(member.id)}
            className="remove-btn"
          >
            Remove
          </button>
        )}
      </div>
    );
};

export default MemberItem;