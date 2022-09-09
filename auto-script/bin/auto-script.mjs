#!/usr/bin/env node
import('../dist/index.mjs').then(r => {
    console.log(r, 'pppppppppppppppppppppppp');
   (r.default || r).run();
});
