import CollapsibleBlock from '../../components/CollapsibleBlock.jsx';
import '../../css/pages/Settings.css'

function Settings() {
  return (
    <div className='wrapper'>
        <div className='content-settings-page'>
        <CollapsibleBlock title="Change Password">
            <div className='block-content'>
                <form>
                <label>Current Password</label>
                <input type="password" />
                <label>New Password</label>
                <input type="password" />
                <button type="submit">Change Password</button>
                </form>
            </div>
        </CollapsibleBlock>
        <CollapsibleBlock title="Change Username">
            <form>
            <label>New Username</label>
            <input type="text" />
            <button type="submit">Change Username</button>
            </form>
        </CollapsibleBlock>
        </div>
    </div>
  );
}

export default Settings;
