export const fetchData = async () => {
    try{
    response = await fetch('https://gist.githubusercontent.com/tameradel209/e90cd5f5d00422e6102ba1ccf4587d85/raw/c3facf7182a4f1ba898998c9365cd7f6a7619104/data.json')
    data = await response.json()
    return data        
    }catch(err){throw new Error(err)}
}