// Image rotation handler [Coded by Jason for visual thought communication 2006]

function Sequence( holder        // the name of the variable in the global namespace that holds this object
                 , images        // array of images, their hrefs and alt tags
                 , wait          // milliseconds to wait between image displays, default: 5000
                 , random        // boolean of whether to display images randomly or not, default: false
                 , auto_pause    // boolean of whether to automatically pause when next/prev/link clicked, default: false
                 , alt_sep       // the separator character(s) for the category in the alt tag, default: :
                 , link_sep      // the separator between image links, default: &nbsp;
                 , label_right   // boolean of whether to place the category label on the right side of the links or not, default: false
                 , img           // the id of the image tag, default: myImage
                 , anchor        // the id of the image anchor, default: img_anchor
                 , text          // the id of the image descriptive text, default: img_text
                 , sequence      // the id of the sequence for sequential/random/resume, default: toggle_text
                 , resume        // the id of the toggle for pause/resume, default: this.toggle
                 , direction     // the id of the direction text to display the direction, default: direction_text
                 , link          // the prefix for the id and class name of the direct image links, default: img_link
                 , backward      // boolean of whether to go backwards or not, default: false
                 , blanks        // boolean of whether to output blanks to make the links square, default: true
                 )
{
   this.holder = holder;

   this.total_images = images.length;

   this.categorised_images = new Array();
   this.images = new Array();

   this.alt_sep = alt_sep ? alt_sep : ':';
   this.default_category = 'defcat';
   this._initialise(images);

   this.random_seed = new Array();
   this._random_seed();

   this.current_random = this._randomise(this.random_seed);
   this.prev_random = this._randomise(this.random_seed);

   this.wait = wait ? wait : 5000;
   this.random = random ? random : false;

   this.auto_pause = auto_pause ? auto_pause : false;

   this.link_sep = link_sep ? link_sep : ' ';
   this.backward = backward ? backward : false;
   this.blanks = blanks ? blanks : true;

   this.label_right = label_right ? label_right : false;

   // element IDs
   this.img = img ? img : 'img_object';
   this.anchor = anchor ? anchor : 'img_anchor';
   this.text = text ? text : 'img_text';
   this.sequence = sequence ? sequence : 'toggle_text';
   this.resume = resume ? resume : this.sequence;
   this.link = link ? link : 'img_link';
   this.direction = direction ? direction : 'img_direction';

   this.cursor = -1;
}

Sequence.prototype.play = function()
{
   this.paused = false;
   this.interval = setInterval(this.holder + '._advanceImage()', this.wait);
}

Sequence.prototype.pause = function()
{
   if( !this.paused && this.interval)
   {
      this.paused = true;
      clearInterval(this.interval);
      return true;
   }
   return false;
}

Sequence.prototype.image = function(id)
{
   var paused = this.pause();
   this._image(id);

   if( paused && !this.auto_pause)
   {
      this.play();
      this._updatePause();
   }
}

Sequence.prototype.prevImage = function()
{
   var paused = this.pause();
   if( this.random && this.advancing)
   {
      this.cursor = this.current_random[this.cursor];
   }
   this.advancing = false;

   this._image(this.cursor - 1);
   
   if( paused && !this.auto_pause)
   {
      this.play();
      this._updatePause();
   }
}

Sequence.prototype.nextImage = function()
{
   var paused = this.pause();
   if( this.random && this.advancing )
   {
      this.cursor = this.current_random[this.cursor];
   }
   this.advancing = false;

   this._image(this.cursor + 1);

   if( paused && !this.auto_pause)
   {
      this.play();
      this._updatePause();
   }
}

Sequence.prototype.advanceImage = function()
{
   var paused = this.pause()
   this._advanceImage();

   if( paused && this.paused )
   {
      this.play();
      this._updatePause();
   }
}

Sequence.prototype._advanceImage = function()
{
   this.advancing = true;

   if( this.random )
   {
      if( this.backward)
      {
         this.cursor--;
         if( this._fixCursor())
         {
            // we fell off the back of the array, so copy the previous to the
            // current and make a new previous
            this.current_random = this.prev_random.slice();
            this.prev_random = this._randomise(this.random_seed);
         }
      }
      else
      {
         this.cursor++;
         if( this._fixCursor())
         {
            // we fell off the end of the array, so copy the current to the
            // previous and make a new current
            this.prev_random = this.current_random.slice();
            this.current_random = this._randomise(this.random_seed);
         }
      }
      this.update(this.current_random[this.cursor]);
   }
   else if(this.backward)
   {
      this._image(this.cursor - 1);
   }
   else
   {
      this._image(this.cursor + 1);
   }
}

Sequence.prototype.retreatImage = function()
{
   var paused = this.pause()
   this.backward = !this.backward;
   this._advanceImage();
   this.backward = !this.backward;
   this._updateDirection();

   if( paused && this.paused )
   {
      this.play();
      this._updatePause();
   }
}

Sequence.prototype.linkOutput = function()
{
   var max_in_cat;
   
   if( this.blanks)
   {
      for( var category in this.categorised_images)
      {
         max_in_cat = max_in_cat > this.categorised_images[category].length ? max_in_cat : this.categorised_images[category].length;
      }
   }

   for( var category in this.categorised_images)
   {
      document.write('<p class="img_category">');
      if(!this.label_right) { document.write(category != this.default_category ? '<span class="img_cat_name">'+ category +'</span>' : '')}

      var first = true;
      var loop_length = this.blanks ? max_in_cat : this.categorised_images[category].length;
      for( var i = 0; i < loop_length; i++)
      {
         if(!first && this.link_sep)
         {
            document.write(this.link_sep);
         }
         if( this.categorised_images[category][i])
         {
            document.write('<a href="#" id="' + this.link + '_' + this.categorised_images[category][i].flat_id +'" onclick="' + this.holder + '.image('+ this.categorised_images[category][i].flat_id +'); return false;" title="'+ this.categorised_images[category][i].alt +'" class="' + this.link + '">'+ (i+1) + '</a>');
         }
         else
         {
            document.write('<span class="blank ' + this.link + '">'+ (i+1) + '</span>');
         }
         first = false;
      }
      if(this.label_right) { document.write(category != this.default_category ? '<span class="img_cat_name">'+ category +'</span>' : '')}
      document.write('</p>');
   }
}

Sequence.prototype.toggleSequence = function()
{
   if( this.sequence == this.resume && this.paused)
   {
      this.play();
      this._updatePause();
   }
   else
   {
      if( this.random)
      {
         this.cursor = this.current_random[this.cursor];
      }
      this.random = !this.random;
   }
   this._updateToggle();
}

Sequence.prototype.togglePause = function()
{
   if( this.paused)
   {
      this.play();
   }
   else
   {
      this.pause();
   }
   this._updatePause();
}

Sequence.prototype.toggleDirection = function()
{
   this.backward = !this.backward;
   this._updateDirection();
}

Sequence.prototype.forward = function()
{
   this.backward = false;
}

Sequence.prototype.backward = function()
{
   this.backward = true;
}

Sequence.prototype.update = function(id)
{
   this._updateImage(id);
   this._updateAnchor(id);
   this._updateText(id);
   this._updateLinks(id);

   this._updateToggle();
   this._updatePause();
   this._updateDirection();
}

Sequence.prototype._image = function(id)
{
   this.cursor = id;
   this._fixCursor();
   this.update(this.cursor);
}

Sequence.prototype._random_seed = function()
{
   for( var i = 0; i < this.images.length; i++)
   {
      this.random_seed[i] = i;
   }
}

Sequence.prototype._updateLinks = function(cursor)
{
   for( var i = 0; i < this.images.length; i++)
   {
      var id = this.link + '_' + i;
      if( document.getElementById(id))
      {
         var link = document.getElementById(id);
         if( i == cursor)
         {
            link.className = 'selected ' + this.link;
         }
         else
         {
            link.className = this.link;
         }
      }
   }
}
 
Sequence.prototype._updateToggle = function()
{
   if( document.getElementById(this.sequence))
   {
      var sequence = document.getElementById(this.sequence);
      if( this.random)
      {
         sequence.className = 'sequential';
         sequence.title = sequence.innerHTML = 'Sequential Playback';
      }
      else
      {
         sequence.className = 'random';
         sequence.title = sequence.innerHTML = 'Random Playback';
      }
   }
}

Sequence.prototype._updateText = function(id)
{
   if( document.getElementById(this.text))
   {
      document.getElementById(this.text).innerHTML = this.images[id].alt;
   }
}

Sequence.prototype._updateDirection = function()
{
   if( document.getElementById(this.direction))
   {
      var direction = document.getElementById(this.direction);
      if( this.backward)
      {
         direction.className = 'forward';
         direction.title = direction.innerHTML = 'Forward Playback';
      }
      else
      {
         direction.className = 'backward';
         direction.title = direction.innerHTML = 'Backward Playback';
      }
      // direction.innerHTML = this.backward ? 'Backward' : 'Forward';
      // direction.className = this.backward ? 'forward' : 'backward';
      // direction.title = direction.innerHTML;
   }
}

Sequence.prototype._updateAnchor = function(id)
{
   if( document.getElementById(this.anchor))
   {
      document.getElementById(this.anchor).href = this.images[id].href;
   }
}

Sequence.prototype._updateImage = function(id)
{
   var image;

   if( document.images[this.img] )
   {
      image = document.images[this.img];
   }
   else if( document.getElementById(this.img))
   {
      image = document.getElementById(this.img);
   }

   if( image)
   {
      var current = this.images[id];

      image.src = current.src;
      image.title = current.alt;
   }
}

Sequence.prototype._randomise = function(seed)
{
   var output = new Array();

   // take a copy of the seed for local modification
   seed = seed.slice();
   var length = seed.length;

   for( var i = 0; i < length; i++)
   {
      var random_index = Math.floor(Math.random()*seed.length);
      output[i] = seed[random_index];
      if( seed.splice )
      {
        seed.splice(random_index,1);
      }
      else
      {
        this._splice(seed,random_index,1);
      }
   }
   return output;
}

Sequence.prototype._splice = function(a,i,l)
{
   for( var j = i; j+l < a.length; j++)
   {
      a[j] = a[j+l];
   }
   a.length = a.length - l;
}

Sequence.prototype._fixCursor = function()
{
   if( this.cursor < 0)
   {
      this.cursor = this.images.length - 1;
      return true;
   }

   if( this.cursor >= this.images.length)
   {
      this.cursor = 0;
      return true;
   }
   return false;
}

Sequence.prototype._initialise = function(images)
{
   //this._preloader();

   for( var i = 0; i < images.length; i++)
   {
      var alt = images[i].alt;
      var parts = alt.match(new RegExp("([^" + this.alt_sep + "]+)\\s*[" + this.alt_sep + "]\\s*(.+)"));
      if( parts && parts.length == 3)
      {
         images[i].category = parts[1];
         images[i].alt = parts[2];
      }
      else
      {
         images[i].category = this.default_category;
      }
      images[i].id = i;

      if( !this.categorised_images[images[i].category])
      {
         this.categorised_images[images[i].category] = new Array();
      }
      
      if( this.categorised_images[images[i].category].push)
      {
        this.categorised_images[images[i].category].push(images[i]);
      }
      else
      {
        this.categorised_images[images[i].category][this.categorised_images[images[i].category].length] = images[i];
      }
   }

   var index = 0;
   for( var category in this.categorised_images)
   {
      for( var i = 0; i < this.categorised_images[category].length; i++)
      {
         this.categorised_images[category][i].flat_id = index;
         this.images[index++] = this.categorised_images[category][i];
      }
   }
}

Sequence.prototype._updatePause = function()
{
   if( document.getElementById(this.resume))
   {
      var resume = document.getElementById(this.resume);

      if( this.resume != this.sequence)
      {
         resume.className = this.paused ? 'resume' : 'pause';
         resume.title = resume.innerHTML = this.paused ? 'Resume Playback' : 'Pause Playback';
      }
      else
      {
         if( this.paused)
         {
            resume.className = 'resume';
            resume.title = resume.innerHTML = 'Resume Playback';
         }
      }
   }
}

Sequence.prototype._preloader = function()
{
   var random = this.random;
   var backward = this.backward;

   var preload = new Image();

   if( backward )
   {
      for( var i = this.images.length - 1; i >= 0; i--)
      {
         if( random )
         {
            i = this.current_random[i];
         }
         preload.src = this.images[i].src;
      }
   }
   else
   {
      for( var i = 0; i < this.images.length; i++)
      {
         if( random )
         {
            i = this.current_random[i];
         }
         preload.src = this.images[i].src;
      }
   }

}

