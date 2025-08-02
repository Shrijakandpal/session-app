import express from 'express';
import Session from '../models/Session.js';
import verifyToken from '../middleware/verifyToken.js';



const router=express.Router();

router.get('/sessions',verifyToken, async (req,res)=>{
    try{
        const publishedSessions = await Session.find({ status:'published'});
        res.status(200).json(publishedSessions);
    }
    catch(error){
        res.status(500).json({message:'Error while fetching the public sessions!'});
    }
});


router.get('/my-sessions', verifyToken, async(req,res)=>{
    try{
        const sessions = await Session.find({ user: req.user.id});
        res.status(200).json(sessions);
    }
    catch(error){
        res.status(500).json({message:'Error fetching your sessions'});
    }
});

router.get('/my-sessions/:id', verifyToken, async(req,res)=>{
    try{ 
        console.log("Requested Session ID:", req.params.id);
          console.log("User ID from token:", req.user.id);    
        const session= await Session.findOne({ _id: req.params.id , user:req.user.id});
        if(!session){
            return res.status(404).json({message:'session not found'});

        }
        res.status(200).json(session);
    }
    catch(error){
        res.status(500).json({message:'Error fetching the sessions!'});
    }
});

router.post('/my-sessions/save-drafts', verifyToken, async (req, res) => {
    console.log('req.user:', req.user);
console.log(' request body:', req.body);

  const { _id, title, tags, json_file_url, notes } = req.body;

  const tagsArray = typeof tags === 'string' ? tags.split(',').map(tag => tag.trim()) : tags;

  try {
    if (_id) {
      const updatedSession = await Session.findOneAndUpdate(
        { _id, user: req.user.id },
        { title, tags: tagsArray, json_file_url, notes, status: 'draft' },
        { new: true }
      );
      if (!updatedSession) {
        return res.status(404).json({ message: ' Session not found' });
      }
      return res.status(200).json(updatedSession);
    } else {
      const newSession = new Session({
        user: req.user.id,
        title,
        tags: tagsArray,
        json_file_url,
        notes,
        status: 'draft'
      });
      const savedSession = await newSession.save();
      return res.status(201).json(savedSession);
    }
  } catch (error) {
     console.error('Error saving draft:', error);
    res.status(500).json({ message: 'Failed to save draft', error: error.message });
  }
});

router.patch('/publish/:id', verifyToken, async (req,res)=>{
    try{
        const publishedSession= await Session.findOneAndUpdate({_id: req.params.id, user: req.user.id}, { status:'published'},{ new: true});
        if(!publishedSession ){
            return res.status(404).json({ message: 'Session not found' });
        }
        
        res.status(200).json(publishedSession);
    }
    catch(error){
         res.status(500).json({ message: 'Error while publishing session', error });
    }
});
router.put('/:id', verifyToken, async (req, res) => {
  try {
     console.log("➡️ PUT called for session:", req.params.id);
    console.log("🔐 User ID:", req.user.id);
    const { title, tags, json_file_url, notes, status } = req.body;

    const updatedSession = await Session.findOneAndUpdate(
      { _id: req.params.id, user : req.user.id },
      {
        title,
        tags,
        json_file_url,
        notes,
        status,
      },
      { new: true } 
    );

    if (!updatedSession) {
      return res.status(404).json({ message: 'Session not found or unauthorized' });
    }

    res.status(200).json(updatedSession);
  } catch (error) {
    console.error('Error updating session:', error);
    res.status(500).json({ message: 'Failed to update session' });
  }
});

router.get('/view/:id', async (req, res) => {
  try {
    console.log('/view route hit with ID:', req.params.id);
    const session = await Session.findById(req.params.id);

    if (!session) {
      console.log('Session not found for ID:', req.params.id);
      return res.status(404).json({ message: 'Session not found' });
    }

    if (session.status !== 'published') {
      console.log('Session is not published');
      return res.status(403).json({ message: 'This session is not published.' });
    }

    console.log('Found published session:', session._id);
    res.json(session);
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
});

router.delete('/:id', verifyToken, async (req, res) => {
  console.log("DELETE route hit. ID:", req.params.id, "User:", req.user.id);

  try {
    const session = await Session.findOne({ _id: req.params.id });
    if (!session) {
      console.log("Session not found.");
      return res.status(404).json({ message: 'Session not found' });
    }

    if (session.user.toString() !== req.user.id) {
      console.log("Unauthorized delete attempt.");
      return res.status(403).json({ message: 'You are not allowed to delete this session.' });
    }

    await Session.deleteOne({ _id: req.params.id });
    console.log("Session deleted.");
    res.status(200).json({ message: 'Session deleted successfully' });
  } catch (err) {
    console.error(" Server error on delete:", err);
    res.status(500).json({ message: 'Server error' });
  }
});



export default router;