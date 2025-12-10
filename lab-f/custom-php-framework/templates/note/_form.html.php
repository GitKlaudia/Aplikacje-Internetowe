<?php
/** @var $note ?\App\Model\Note */
?>

<div class="form-group">
    <label for="title">Title</label>
    <input type="text" id="title" name="note[title]" value="<?= $note ? $note->getTitle() : '' ?>">
</div>

<div class="form-group">
    <label for="body">Body</label>
    <textarea id="body" name="note[body]"><?= $note ? $note->getBody() : '' ?></textarea>
</div>

<div class="form-group">
    <label></label>
    <input type="submit" value="Submit">
</div>
